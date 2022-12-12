from rest_framework.test import APITestCase

from .utils import get_access_token, get_refresh_token


class TestGenericFunctions(APITestCase):
    def test_get_access_tokent(self):
        payload = {
            "id": 1
        }

        token = get_access_token(payload)

        self.assertTrue(token)

    def test_get_refresh_token(self):
        token = get_refresh_token()

        self.assertTrue(token)


class TestAuthentication(APITestCase):
    login_url = '/user/login/'
    register_url = '/user/register/'
    refresh_url = '/user/refresh/'

    def test_register(self):
        payload = {
            "username": "gorkemayten",
            "password": "p12345",
            "email": "gorkem.ayten@ug.bilkent.edu.tr"
        }

        response = self.client.post(self.register_url, data=payload)

        self.assertEqual(response.status_code, 201)

    def test_login(self):
        payload = {
            "username": "gorkemayten",
            "password": "p12345",
            "email": "gorkem.ayten@ug.bilkent.edu.tr"
        }

        # register
        self.client.post(self.register_url, data=payload)

        # login
        response = self.client.post(self.login_url, data=payload)
        result = response.json()

        # check that we obtain a status of 200
        self.assertEqual(response.status_code, 200)

        # check that we obtained both the refresh and access token
        self.assertTrue(result["access"])
        self.assertTrue(result["refresh"])

    def test_refresh(self):
        payload = {
            "username": "gorkemayten",
            "password": "p12345",
            "email": "gorkem.ayten@ug.bilkent.edu.tr"
        }

        # register
        self.client.post(self.register_url, data=payload)

        # login
        response = self.client.post(self.login_url, data=payload)
        refresh = response.json()["refresh"]

        # get refresh
        response = self.client.post(
            self.refresh_url, data={"refresh": refresh})
        result = response.json()

        # check that we obtain a status of 200
        self.assertEqual(response.status_code, 200)

        # check that we obtained both the refresh and access token
        self.assertTrue(result["access"])
        self.assertTrue(result["refresh"])
