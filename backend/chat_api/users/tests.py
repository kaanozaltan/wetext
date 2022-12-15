from rest_framework.test import APITestCase, APIClient


class TestAuthentication(APITestCase):
    register_url = "/api/user/register/"
    login_url = "/api/user/login/"
    logout_url = "/api/user/logout/"

    def setUp(self):
        self.client = APIClient()

    def test_register_successful(self):
        data = {
            "username": "test-user",
            "first_name": "test",
            "last_name": "user",
            "password": "deneme",
        }
        response = self.client.post(path=self.register_url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, "User successfully created.")

    def test_login_successful(self):
        data_register = {
            "username": "test-user",
            "first_name": "test",
            "last_name": "user",
            "password": "deneme",
        }
        self.client.post(path=self.register_url, data=data_register)

        data_login = {
            "username": data_register["username"],
            "password": data_register["password"]
        }
        response = self.client.post(path=self.login_url, data=data_login)
        self.assertEqual(response.status_code, 200)

    def test_login_fail(self):
        data_register = {
            "username": "test-user",
            "first_name": "test",
            "last_name": "user",
            "password": "deneme",
        }
        self.client.post(path=self.register_url, data=data_register)

        data_login = {
            "username": data_register["first_name"],
            "password": data_register["password"]
        }
        response = self.client.post(path=self.login_url, data=data_login)
        self.assertEqual(response.status_code, 404)

        data_login = {
            "username": data_register["username"],
            "password": "wrongpassword"
        }
        response = self.client.post(path=self.login_url, data=data_login)
        self.assertEqual(response.status_code, 404)

        data_login = {
            "username": data_register["first_name"],
            "password": "wrongpassword"
        }
        response = self.client.post(path=self.login_url, data=data_login)
        self.assertEqual(response.status_code, 404)
