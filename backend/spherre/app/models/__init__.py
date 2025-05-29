from app.extensions import db


def session_save():
    db.session.commit()
