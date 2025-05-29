from app.extensions import db
from datetime import datetime
import uuid


def generate_uuid():
    """Generate UUID4 as string"""
    return str(uuid.uuid4())

account_members = db.Table('account_members',
    db.Column('account_id', db.String, db.ForeignKey('accounts.id'), primary_key=True),
    db.Column('member_id', db.String, db.ForeignKey('member.id'), primary_key=True)
)

class ModelMixin:
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def __init__(self, **kwargs):
        if 'id' not in kwargs:
            kwargs['id'] = generate_uuid()
        super().__init__(**kwargs)

    @classmethod
    def create(cls, **kwargs):
        obj = cls(**kwargs)
        db.session.add(obj)
        db.session.commit()
        return obj
    
    @classmethod
    def get_or_create(cls, **kwargs):
        obj = cls.query.filter_by(**kwargs).one_or_none()
        return obj if obj else cls.create(**kwargs)
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Account(ModelMixin, db.Model):
    __tablename__ = "accounts"
    name = db.Column(db.String(100), required = True)
    description = db.Column(db.String, nullable = True, required = False)
    is_private = db.Column(db.Boolean, default = True)
    threshold = db.Column(db.Integer)
    members = db.relationship("Member",secondary=account_members,backref="members")

    def __repr__(self):
        return f"<Account {self.name} >"

class Member(ModelMixin, db.Model):
    __tablename__ = "members"
    address = db.Column(db.String, unique = True, nullable = False)
    email = db.Column(db.String, required = False, nullable = True)
    account_id = db.Column(db.String,db.ForeignKey('accounts.id'))

    def __repr__(self):
        return f"<Member {self.address[0:10]}... >"