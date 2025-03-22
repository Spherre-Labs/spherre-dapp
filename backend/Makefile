build:
	pip install -r requirements.txt

format:
	ruff format .
	ruff check . --fix --select I

lint:
	ruff check .

start:
	python spherre/wsgi.py