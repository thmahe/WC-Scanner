from unittest import TestCase
import app
import os

class TestCreateProject(TestCase):
    def test_createProject(self):
        app.createProject("test")

        self.assertEqual(1, len(os.listdir(app.APP_PATH)))

        app.createProject("test")
        self.assertEqual(2, len(os.listdir(app.APP_PATH)))

        self.assertTrue("test_1" in os.listdir(app.APP_PATH))

        os.rmdir(app.APP_PATH + "/test")
        os.rmdir(app.APP_PATH + "/test_1")

        self.assertEqual(0, len(os.listdir(app.APP_PATH)))

