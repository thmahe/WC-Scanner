import unittest
import logging

from core.scanner import Scanner
from util import project_manager as pm
from util import context_finder as context


class TestProjectManager(unittest.TestCase):
    """
    Test of the project manager :
        create / delete project
        retrieve projects configurations stored on disk etc...
    """

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


    def test_remove_project(self):
        pm.create_project('foo')
        self.assertListEqual(['foo'], pm.list_projects())
        pm.remove_single_project('foo')
        self.assertListEqual([], pm.list_projects())

    def test_remove_project_2(self):
        pm.create_project('foo')
        pm.create_project('bar')
        self.assertCountEqual(['foo', 'bar'], pm.list_projects())
        pm.remove_single_project('foo')
        self.assertListEqual(['bar'], pm.list_projects())
        pm.__remove_all_projects__()

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
        data = pm.get_projects_data()
        self.assertEqual(1, len(data))

        project = data[0]
        self.assertEqual('test1', project["name"])
        self.assertIsNotNone(project["preview_data"])
        self.assertEqual('', project['description'])
        self.assertEqual(15, project['pict_per_rotation'])
        self.assertEqual('1640x1232', project['pict_res'])
        self.assertEqual(0, project['size'])

        pm.__remove_all_projects__()

    def test_retrieve_projects_data_2(self):
        pm.create_project("my_awesome_project", "beauty isn't it ?", 30, "3280x2464")
        data = pm.get_projects_data()
        self.assertEqual(1, len(data))

        project = data[0]
        self.assertEqual('my_awesome_project', project["name"])
        self.assertIsNotNone(project["preview_data"])
        self.assertEqual('beauty isn\'t it ?', project['description'])
        self.assertEqual(30, project['pict_per_rotation'])
        self.assertEqual('3280x2464', project['pict_res'])
        self.assertEqual(0, project['size'])

        pm.__remove_all_projects__()

    def test_retrieve_projects_data_update_after_scan_loop(self):
        pm.create_project("my_awesome_project", "beauty isn't it ?", 30, "3280x2464")
        data = pm.get_projects_data()

        self.assertEqual(1, len(data))
        project = data[0]

        self.assertEqual('my_awesome_project', project["name"])
        self.assertIsNotNone(project["preview_data"])
        self.assertEqual('beauty isn\'t it ?', project['description'])
        self.assertEqual(30, project['pict_per_rotation'])
        self.assertEqual('3280x2464', project['pict_res'])
        self.assertEqual(0, project['size'])

        scanner = Scanner()

        scanner.loop_capture(project['name'])

        data = pm.get_projects_data()
        self.assertEqual(1, len(data))
        project_after = data[0]

        self.assertNotEqual(project_after['size'], project['size'])
        self.assertNotEqual(project_after['preview_data'], project['preview_data'])
        # Data's are updated

        pm.__remove_all_projects__()


if __name__ == '__main__':
    unittest.main()
