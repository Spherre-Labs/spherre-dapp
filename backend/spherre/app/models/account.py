from spherre.app.extensions import db
from spherre.app.models.base import ModelMixin




account_members = db.Table(
    "account_members",
    db.Column("account_id", db.String, db.ForeignKey("accounts.id"), primary_key=True),
    db.Column("member_id", db.String, db.ForeignKey("members.id"), primary_key=True),
)





class Account(ModelMixin, db.Model):
    __tablename__ = "accounts"
    address = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String, nullable=True)
    is_private = db.Column(db.Boolean, default=True)
    threshold = db.Column(db.Integer)
    members = db.relationship("Member", secondary=account_members, backref="accounts")

    def __repr__(self):
        return f"<Account {self.name} >"


class Member(ModelMixin, db.Model):
    __tablename__ = "members"
    address = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, nullable=True)

    def __repr__(self):
        return f"<Member {self.address[0:10]}... >"
