from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

import urllib.parse

# We will use aiomysql for async MySQL operations
# Ensure the user provides MYSQL_URL like: mysql+aiomysql://user:password@localhost/dbname
raw_url = os.getenv("MYSQL_URL")

if raw_url and "mysql+aiomysql://" in raw_url:
    # Safely handle passwords with '@' by quoting the password part
    # format: mysql+aiomysql://root:password@host:port/dbname
    try:
        prefix, rest = raw_url.split("://", 1)
        auth, host_db = rest.split("@", 1)
        
        # If the password itself has an @ in it, it will improperly split here.
        # Fallback to standard url parsing to rebuild the connection safely:
        parsed = urllib.parse.urlparse(raw_url)
        safe_password = parsed.password or ""
        encoded_password = urllib.parse.quote_plus(safe_password)
        DATABASE_URL = f"{parsed.scheme}://{parsed.username}:{encoded_password}@{parsed.hostname}:{parsed.port}/{parsed.path.lstrip('/')}"
    except Exception as e:
        print(f"Warning: could not parse MYSQL_URL properly: {e}")
        DATABASE_URL = raw_url
else:
    DATABASE_URL = raw_url or "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
