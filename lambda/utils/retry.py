import time
from botocore.exceptions import ClientError

MAX_RETRIES = 5
RETRY_DELAY = 15  # seconds

def retry_operation(func, *args, **kwargs):
    for attempt in range(MAX_RETRIES):
        try:
            return func(*args, **kwargs)
        except (ClientError, Exception) as e:
            if attempt == MAX_RETRIES - 1:
                print(f"Operation failed after {MAX_RETRIES} attempts. Error: {str(e)}")
                raise
            print(f"Attempt {attempt + 1} failed. Retrying in {RETRY_DELAY} seconds...")
            time.sleep(RETRY_DELAY)
