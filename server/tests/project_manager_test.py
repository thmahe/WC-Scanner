import unittest
import logging

from util import project_manager as pm


class TestProjectManager(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        logging.disable(logging.CRITICAL)

    def test_no_project(self):
        self.assertListEqual([], pm.list_projects())

    def test_no_project_no_base_path(self):
        pm.__remove_base_directory__()
        self.assertListEqual([], pm.list_projects())


    def test_single_project(self):
        pm.create_project('test')
        self.assertListEqual(['test'], pm.list_projects())
        pm.__remove_all_projects__()
        self.assertListEqual([], pm.list_projects())

    def test_multiple_project(self):
        pm.create_project('foo')
        pm.create_project('bar')
        self.assertListEqual(['foo', 'bar'], pm.list_projects())
        pm.__remove_all_projects__()

    def test_multiple_project_same_name(self):
        pm.create_project('foo')
        pm.create_project('foo')
        pm.create_project('foo')
        self.assertListEqual(['foo', 'foo_1', 'foo_2'], pm.list_projects())
        pm.__remove_all_projects__()


if __name__ == '__main__':
    unittest.main()
