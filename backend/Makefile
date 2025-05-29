build:
	pip install -r requirements.txt

format:
	ruff format .
	ruff check . --fix --select I

lint:
	ruff check .

start:
	python spherre/wsgi.py

makemigration:
	cd spherre && flask db migrate -m "$(message)"

db_init:
	cd spherre && flask db init

migrate:
	cd spherre && flask db upgrade
