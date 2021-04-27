import mysql.connector
import os
import subprocess
import unittest
import yaml

db_path = os.path.dirname(os.path.abspath(__file__)) + '/../../../src/central_system/sql/sep_db.sql'
db_name = 'comp2913_sep'
YAML_PATH = os.path.dirname(os.path.abspath(__file__)) + '/test_db.yaml'


class TestDb(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        # Connect to the MySQL server, and create new database for test sequence
        try:
            print 'CONNECTING TO MYSQL SERVER...',  

            self.db = mysql.connector.connect(
                host='localhost',
                user='web_comp2913'
            )
            print 'SUCCESS!'


            print 'DELETING EXISTING DATABASE: ' + db_name +'\n'
            try:
                self.cursor = self.db.cursor()
                self.cursor.execute('DROP DATABASE IF EXISTS {}'.format(db_name))
            except mysql.connector.errors.DatabaseError as e:
                print e
                assert False
            

            print 'IMPORTING FROM PROJECT SQL FILE...',
            p = subprocess.check_call('mysql -u sep --password=sepword < {}'.format(db_path), stderr=subprocess.PIPE, shell=True)
            print 'SUCCESS!'

            print 'USING IMPORTED DATABASE: ' + db_name + '\n'
            self.cursor.execute('USE {}'.format(db_name))

        except mysql.connector.errors.ProgrammingError as e:
            print '\n', e
            assert False
        except subprocess.CalledProcessError as e:
            print
            print '\n', e
            assert False
        
        # load the yaml file with test cases
        self.test_cases = yaml.safe_load(open(YAML_PATH,'r'))


    def assert_commands(self, cases):
        for case in cases:
            try:
                self.cursor.execute(case['command'])
                if not case['result']:
                    self.fail('invalid query {} should throw an error'.format(case['command']))
            except mysql.connector.errors.DatabaseError as e:
                if case['result']:
                    self.fail('valid query {} failed'.format(case['command']))

    def test_0_new_sport(self):
        cases = self.test_cases['test_0']
        self.assert_commands(cases)

    def test_1_new_activity(self):
        cases = self.test_cases['test_1']
        self.assert_commands(cases)

    def test_2_new_user(self):
        cases = self.test_cases['test_2']
        self.assert_commands(cases)

    def test_3_new_card(self):
        cases = self.test_cases['test_3']
        self.assert_commands(cases)
    
    def test_4_new_card_user(self):
        cases = self.test_cases['test_4']
        self.assert_commands(cases)

    def test_5_new_booked_activity(self):
        cases = self.test_cases['test_5']
        self.assert_commands(cases)

    def test_6_new_payment(self):
        cases = self.test_cases['test_6']
        self.assert_commands(cases)
    

        

    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        try:
            print
            print 'DROPPING TEST DATABASE: ' + db_name
            self.cursor.execute('DROP DATABASE ' + db_name)
        except mysql.connector.errors.ProgrammingError as e:
            print e

if __name__ == '__main__':
    unittest.main()