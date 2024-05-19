import json
import math
import boto3
from botocore.exceptions import ClientError
from utils.lambda_utils import invoke_lambda
from utils.s3_utils import get_s3_object_as_text, put_s3_object

sqs_client = boto3.client('sqs')

def score_page(content: str) -> int:
    return len(content.split())  # Simple word count as content density score

def fetch_note_content(note_key: str) -> str:
    s3_bucket_name = 'spellbook-imagestore-ocr-results'
    s3_key = f'processed/{note_key}'
    try:
        note_content = get_s3_object_as_text(s3_bucket_name, s3_key)
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            print(f"Error: The key {s3_key} does not exist in bucket {s3_bucket_name}.")
            return None
        else:
            raise
    return note_content

def softmax(x):
    max_x = max(x)
    e_x = [math.exp(i - max_x) for i in x]
    sum_e_x = sum(e_x)
    return [i / sum_e_x for i in e_x]

def calculate_questions_per_note(note_scores, total_questions):
    note_scores.sort(key=lambda x: x[1], reverse=True)
    scores = [score for _, score in note_scores]
    probabilities = softmax(scores)
    questions_per_note = []
    remaining_questions = total_questions

    for i, (note_key, _) in enumerate(note_scores):
        questions_for_note = int(probabilities[i] * total_questions)
        questions_per_note.append((note_key, questions_for_note))
        remaining_questions -= questions_for_note

    i = 0
    while remaining_questions > 0:
        note_key, current_questions = questions_per_note[i]
        if current_questions < 10:
            questions_per_note[i] = (note_key, current_questions + 1)
            remaining_questions -= 1
        i = (i + 1) % len(questions_per_note)

    return questions_per_note

def lambda_handler(event, context):
    combined_quizzes = []
    total_requested_questions = 0
    total_actual_questions = 0
    total_llm_requested_questions = 0

    for record in event['Records']:
        results = []
        all_notes_content = []
        message_body = json.loads(record['body'])
        note_keys = message_body['noteKeys']
        num_questions = int(message_body['numQuestions'])
        job_id = message_body['jobUuid']

        total_requested_questions += num_questions

        note_scores = []
        for note_key in note_keys:
            note_content = fetch_note_content(note_key)
            if note_content is not None:
                all_notes_content.append(note_content)
                score = score_page(note_content)
                note_scores.append((note_key, score))

        questions_per_note = calculate_questions_per_note(note_scores, num_questions)

        for note_key, num_questions_for_note in questions_per_note:
            if num_questions_for_note > 0:
                payload = {
                    'noteKeys': [note_key],
                    'numQuestions': num_questions_for_note
                }
                response = invoke_lambda('quizGeneration', payload)
                results.append(response)
                total_llm_requested_questions += num_questions_for_note
                total_actual_questions += len(response['body']['questions'])

        combined_quiz = {'questions': [q for result in results for q in result['body']['questions']]}
        combined_quizzes.append(combined_quiz)

        s3_bucket_name = 'spellbook-generated-quizzes'
        s3_key = f'quizzes/{job_id}.json'
        put_s3_object(s3_bucket_name, s3_key, json.dumps(combined_quiz))

    return {
        'statusCode': 200,
        'numQuizzesProcessed': len(event['Records']),
        'combinedQuizzes': combined_quizzes,
        'totalRequestedQuestions': total_requested_questions,
        'totalLLMRequestedQuestions': total_llm_requested_questions,
        'totalActualQuestions': total_actual_questions
    }