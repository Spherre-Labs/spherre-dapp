from unittest import TestCase

from spherre.app import create_app
from spherre.app.extensions import db


class TestNotificationModel(TestCase):
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

    def test_create_notification_model():
        # TODO: write test case for creating notifications
        pass

    def test_update_notification_model():
        # TODO: write test case for updating notifications
        pass
