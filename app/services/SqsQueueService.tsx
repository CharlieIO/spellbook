import { IQueueService } from '../interfaces/IQueueService';
import { sqsClient } from '../lib/awsClient';
import { SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, GetQueueAttributesCommand } from '@aws-sdk/client-sqs';

class SqsQueueService implements IQueueService {
    private queueUrl: string;

    constructor() {
        const queueUrl = process.env.SQS_QUEUE_URL;
        if (!queueUrl) {
            throw new Error("SQS_QUEUE_URL environment variable is missing");
        }
        this.queueUrl = queueUrl;
    }

    async enqueue(item: any): Promise<void> {
        const params = {
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(item),
        };

        try {
            await sqsClient.send(new SendMessageCommand(params));
        } catch (error) {
            console.error('Error enqueuing item:', error);
            throw new Error('Failed to enqueue item');
        }
    }

    async dequeue(): Promise<any> {
        const params = {
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 1,
        };

        try {
            const data = await sqsClient.send(new ReceiveMessageCommand(params));
            if (data.Messages && data.Messages.length > 0) {
                const message = data.Messages[0];
                await this.deleteMessage(message.ReceiptHandle!);
                return JSON.parse(message.Body!);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error dequeuing item:', error);
            throw new Error('Failed to dequeue item');
        }
    }

    async peek(): Promise<any> {
        const params = {
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 0, // Ensures the message is not hidden after being read
        };

        try {
            const data = await sqsClient.send(new ReceiveMessageCommand(params));
            if (data.Messages && data.Messages.length > 0) {
                return JSON.parse(data.Messages[0].Body!);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error peeking item:', error);
            throw new Error('Failed to peek item');
        }
    }

    async isEmpty(): Promise<boolean> {
        const params = {
            QueueUrl: this.queueUrl,
            AttributeNames: ['ApproximateNumberOfMessages'],
        };

        try {
            const data = await sqsClient.send(new GetQueueAttributesCommand({
                QueueUrl: this.queueUrl,
                AttributeNames: ['ApproximateNumberOfMessages' as const],
            }));
            const messageCount = parseInt(data.Attributes?.ApproximateNumberOfMessages || '0', 10);
            return messageCount === 0;
        } catch (error) {
            console.error('Error checking if queue is empty:', error);
            throw new Error('Failed to check if queue is empty');
        }
    }

    async size(): Promise<number> {
        const params = {
            QueueUrl: this.queueUrl,
            AttributeNames: ['ApproximateNumberOfMessages'],
        };

        try {
            const data = await sqsClient.send(new GetQueueAttributesCommand({
                QueueUrl: this.queueUrl,
                AttributeNames: ['ApproximateNumberOfMessages' as const],
            }));
            return parseInt(data.Attributes?.ApproximateNumberOfMessages || '0', 10);
        } catch (error) {
            console.error('Error getting queue size:', error);
            throw new Error('Failed to get queue size');
        }
    }

    private async deleteMessage(receiptHandle: string): Promise<void> {
        const params = {
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle,
        };

        try {
            await sqsClient.send(new DeleteMessageCommand(params));
        } catch (error) {
            console.error('Error deleting message:', error);
            throw new Error('Failed to delete message');
        }
    }
}

export default SqsQueueService;
