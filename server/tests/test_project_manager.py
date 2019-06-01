import unittest
import logging

from util import project_manager as pm
from util import context_finder as context

class TestProjectManager(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        context.set_test_mode()
        pm.__remove_all_projects__()
        logging.disable(logging.CRITICAL)

    @classmethod
    def tearDownClass(cls):
        pm.__remove_base_directory__()

    def test_no_project(self):
        self.assertCountEqual([], pm.list_projects())

    def test_no_project_no_base_path(self):
        pm.__remove_base_directory__()
        self.assertCountEqual([], pm.list_projects())


    def test_single_project(self):
        pm.create_project('test')
        self.assertListEqual(['test'], pm.list_projects())
        pm.__remove_all_projects__()
        self.assertCountEqual([], pm.list_projects())

    def test_multiple_project(self):
        pm.create_project('foo')
        pm.create_project('bar')
        self.assertCountEqual(['foo', 'bar'], pm.list_projects())
        pm.__remove_all_projects__()

    def test_multiple_project_same_name(self):
        pm.create_project('foo')
        pm.create_project('foo')
        pm.create_project('foo')
        self.assertCountEqual(['foo', 'foo_1', 'foo_2'], pm.list_projects())
        pm.__remove_all_projects__()

    def test_retrieve_projects_data(self):
        pm.create_project("test1")
        pm.get_projects_data()
        pm.__remove_all_projects__()


if __name__ == '__main__':
    unittest.main()
