import json
import openai
from app.core.config import settings

class AIPipelineService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def verify_work_proof(self, before_url: str, after_url: str, task_type: str):
        """
        Uses GPT-4o Vision to verify the work proof.
        Returns a dictionary with confidence, quality score, and status.
        """
        if not self.client:
            # Mock success for MVP if no API key
            return {
                "confidence": 0.95,
                "quality_score": 8,
                "status": "approved",
                "fraud_risk": 0.02
            }

        prompt = f"""
        You are an AI auditor for GovTrack AI. Verify if the work described as '{task_type}' has been completed.
        Compare the 'before' image and the 'after' image.
        
        Provide the result in JSON format:
        {{
            "confidence": float (0-1),
            "quality_score": int (0-10),
            "status": "approved" | "rejected" | "review",
            "fraud_risk": float (0-1),
            "reason": "string"
        }}
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": before_url}},
                            {"type": "image_url", "image_url": {"url": after_url}},
                        ],
                    }
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            # Fallback to review status on error
            return {
                "confidence": 0.0,
                "quality_score": 0,
                "status": "review",
                "fraud_risk": 0.0,
                "reason": str(e)
            }

ai_pipeline = AIPipelineService()
