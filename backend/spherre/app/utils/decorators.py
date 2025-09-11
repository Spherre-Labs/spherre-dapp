from functools import wraps

from flask_jwt_extended import jwt_required


def login_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)

    return decorated_function


def login_required_optional(f):
    @wraps(f)
    @jwt_required(optional=True)
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)

    return decorated_function
