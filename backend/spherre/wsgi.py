from settings import app as flask_app

if __name__ == "__main__":
    import app  # noqa

    flask_app.run(debug=True)
