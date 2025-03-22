from flask_restful import Api, Resource
from settings import app

api = Api(app)


class TestView(Resource):
    def get(self):
        return {"message": "Hello world"}


api.add_resource(TestView, "/")
