import boto3
from app.core.config import settings

class StorageService:
    def __init__(self):
        # This could be S3 or Supabase Storage
        # For MVP, we'll provide an interface for S3 if credentials exist
        self.s3 = boto3.client('s3') if hasattr(settings, 'S3_BUCKET') else None
        self.bucket = getattr(settings, 'S3_BUCKET', 'govtrack-media')

    def upload_file(self, file_content, file_name, content_type):
        if self.s3:
            self.s3.put_object(
                Bucket=self.bucket,
                Key=file_name,
                Body=file_content,
                ContentType=content_type
            )
            return f"https://{self.bucket}.s3.amazonaws.com/{file_name}"
        else:
            # Mock or Supabase Storage implementation
            # For now, return a mock URL
            return f"https://storage.mock.com/{file_name}"

storage_service = StorageService()
