from unittest import TestCase

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.service.member import MemberService


class TestMemberService(TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_get_member_by_address(self):
        member = MemberService.get_member_by_address("0x123")
        assert member is None
        MemberService.get_or_create_member("0x123")
        member = MemberService.get_member_by_address("0x123")
        assert member is not None
        assert member.address == "0x123"

    def test_update_member_email(self):
        member = MemberService.get_or_create_member("0x123")
        assert member is not None
        assert member.email is None
        member = MemberService.update_member_email("0x123", "test@email.com")
        assert member is not None
        assert member.email == "test@email.com"

    def test_get_or_create_member(self):
        member = MemberService.get_or_create_member("0x123", email="test@email.com")
        assert member is not None
        assert member.address == "0x123"
        assert member.email == "test@email.com"

    def test_get_or_create_member_no_email(self):
        member = MemberService.get_or_create_member("0x123")
        assert member is not None
        assert member.address == "0x123"
        assert member.email is None
