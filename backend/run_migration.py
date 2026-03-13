from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE scoring_rules ADD COLUMN custom_weights JSONB DEFAULT '[]'::jsonb;"))
        conn.commit()
        print("Success: Added custom_weights to scoring_rules")
    except Exception as e:
        print(f"Migration error (might already exist): {e}")
