import os

from .app import create_app

app = create_app(os.getenv("FLASK_CONFIG") or "development")
if __name__ == "__main__":
    from .app.extensions import db
    with app.app_context():
        db.create_all()
        print("[+] Database initialized successfully.")