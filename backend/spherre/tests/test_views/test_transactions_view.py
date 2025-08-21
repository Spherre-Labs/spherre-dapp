import unittest
from datetime import datetime
from unittest.mock import patch

from spherre.app import create_app
from spherre.app.extensions import db
from spherre.app.models.account import Account, Member
from spherre.app.models.transaction import (
    TransactionStatus,
    TransactionType,
)
from spherre.app.service.transaction import TransactionService


class TestTransactionViews(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        self.account = Account.create(
            address="0x" + "2" * 64,
            name="Test Account",
            threshold=2,
            description="Test Account Description",
        )
        self.member = Member.get_or_create(address="0x" + "1" * 64)

        self.account.members.append(self.member)
        db.session.commit()

        self.current_time = datetime.now()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def create_transaction(
        self,
        transaction_id: int,
        status=TransactionStatus.INITIATED,
        type=TransactionType.TOKEN_SEND,
    ):
        transaction = TransactionService.create_transaction(
            transaction_id=transaction_id,
            account=self.account,
            status=TransactionStatus.INITIATED,
            tx_type=TransactionType.TOKEN_SEND,
            proposer=self.member,
            date_proposed=self.current_time,
        )
        return transaction

    def test_get_transactions_success(self):
        self.create_transaction(transaction_id=1)
        self.create_transaction(transaction_id=2)

        res = self.client.get(f"/api/v1/accounts/{self.account.address}/transactions")
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        self.assertIn("transactions", data)
        self.assertEqual(len(data["transactions"]), 2)
        self.assertEqual(data["pagination"]["total"], 2)

    def test_get_transactions_with_pagination(self):
        for i in range(5):
            self.create_transaction(transaction_id=10 + i)

        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/transactions?page=1&per_page=2"
        )
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        self.assertEqual(len(data["transactions"]), 2)
        self.assertEqual(data["pagination"]["total_pages"], 3)
        self.assertTrue(data["pagination"]["has_next"])
        self.assertFalse(data["pagination"]["has_prev"])

    def test_get_transactions_filtered_by_type(self):
        _transaction1 = TransactionService.create_transaction(
            transaction_id=10,
            account=self.account,
            status=TransactionStatus.INITIATED,
            tx_type=TransactionType.TOKEN_SEND,
            proposer=self.member,
            date_proposed=self.current_time,
        )

        _transaction2 = TransactionService.create_transaction(
            transaction_id=11,
            account=self.account,
            status=TransactionStatus.INITIATED,
            tx_type=TransactionType.NFT_SEND,
            proposer=self.member,
            date_proposed=self.current_time,
        )
        db.session.commit()

        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/transactions?tx_type={TransactionType.TOKEN_SEND.value}"
        )
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        print(data)
        self.assertIn("transactions", data)
        self.assertEqual(len(data["transactions"]), 1)
        self.assertEqual(
            data["transactions"][0]["tx_type"], TransactionType.TOKEN_SEND.value
        )

    def test_get_transactions_invalid_pagination(self):
        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/transactions?page=0&per_page=-5"
        )
        self.assertEqual(res.status_code, 400)

    def test_get_transactions_account_not_found(self):
        res = self.client.get(f"/api/v1/accounts/0x{'f' * 64}/transactions")
        self.assertEqual(res.status_code, 404)

    def test_get_transactions_invalid_tx_type(self):
        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/transactions?tx_type=INVALID_TYPE"
        )
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("error", data)
        self.assertIn("Invalid tx_type parameters", data["error"]["code"])

    def test_get_transactions_invalid_status(self):
        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/transactions?status=INVALID_STATUS"
        )
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("error", data)
        self.assertIn("Invalid status parameters", data["error"]["code"])

    def test_get_transactions_with_sorting(self):
        for i in range(5):
            self.create_transaction(transaction_id=10 + i)

        res = self.client.get(
            f"/api/v1/accounts/{self.account.address}/transactions?sort_by=date_created&sort_order=asc"
        )
        self.assertEqual(res.status_code, 200)

        data = res.get_json()
        self.assertEqual(len(data["transactions"]), 5)
        self.assertTrue(
            all(
                data["transactions"][i]["date_created"]
                <= data["transactions"][i + 1]["date_created"]
                for i in range(len(data["transactions"]) - 1)
            )
        )

    def test_get_transactions_server_error(self):
        with patch.object(
            TransactionService,
            "get_filtered_transactions",
            side_effect=Exception("DB Error"),
        ):
            res = self.client.get(
                f"/api/v1/accounts/{self.account.address}/transactions"
            )
            self.assertEqual(res.status_code, 500)
