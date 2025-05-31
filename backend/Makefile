build:
	pip install -r requirements.txt

format:
	ruff format .
	ruff check . --fix --select I

lint:
	ruff check .

run:
	python -m spherre.wsgi

makemigration:
	cd spherre && flask db migrate -m "$(command)"

db_init:
	cd spherre && flask db init

migrate:
	cd spherre && flask db upgrade
