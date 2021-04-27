import unittest
import requests
import json
import yaml
import os
import mysql.connector
import subprocess
from requests_toolbelt import MultipartEncoder

HOST = 'http://127.0.0.1:3000'
# CSURF COMBINATION THAT ACTUALLY WORKS
COOKIES =  {'_csrf' : 'plshelpme'}
CSRF_TOKEN = {'_csrf': 'iSIzC89x-luXTapA58TaKgGNEokgJUVSTLj4'}
# This session is valid for 57,000 years. Hopefully it is enough time to finish unit testing
SESSION = {'session': 'jBVdtfp-y9SPjDRcdCDt7g.rjtTuD3z0VKzAexeJVOphP3P14jJ4P3vGGzWWbYR_ishFfvGst2iAbobxD_Lbj5c.1586898844860.1800000000000000.76ducV8-2RnaMEodlCMvpJpjlXsn-OrSaR_yGDG72Ls'}

YAML_PATH = os.path.dirname(os.path.abspath(__file__)) + '/test_node.yaml'
db_path = os.path.dirname(os.path.abspath(__file__)) + '/../../../src/central_system/sql/sep_db.sql'
db_name = 'comp2913_sep'


class TestNode(unittest.TestCase):
    @classmethod
    def setUpClass(self):
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

        # load test yaml
        self.test_cases = yaml.safe_load(open(YAML_PATH,'r'))

    
    def assert_post(self, url, cases, cookies, is_json):
        for case in cases:
            payload = dict(case['payload'].items() + CSRF_TOKEN.items())

            # JSON/Multipart POST request
            if is_json:
                resp = requests.post(url, data=json.dumps(payload), headers={'content-type': 'application/json'}, cookies=dict(COOKIES.items() + cookies.items()))            
            else:
                m =  MultipartEncoder(fields=payload)
                resp = requests.post(url, data=m, headers={'content-type': m.content_type}, cookies=dict(COOKIES.items() + cookies.items()))

            passed = True
            for line in resp.text.split('\n'):
                if 'error' in line and 'none' not in line:
                    passed = False

            # valid requests should pass
            # invallid requests should throw an error
            if case['result'] and not passed:
                self.fail('valid request {} failed'.format(case['payload']))
            if not case['result'] and passed:
                self.fail('invalid request {} should throw an error'.format(case['payload']))


    def assert_get(self, url, result, cookies):
        resp = requests.get(url, cookies=dict(COOKIES.items() + cookies.items()))
        for string in result['contains']:
            if not string in resp.text:
                self.fail('Valid information {} was not added'.format(string))

        for string in result['not_contains']:
            if string in resp.text:
                self.fail('Invalid information {} was added'.format(string))


    def test_0_register_and_login(self):
        url = HOST + '/user/register'
        cases = self.test_cases['test_0_0']
        cookies = {}
        self.assert_post(url, cases, cookies, True)
        
        url = HOST + '/user/login'
        cases = self.test_cases['test_0_1']
        cookies = {}
        self.assert_post(url, cases, cookies, True)


    def test_1_new_activity_post_and_get(self):
        url = HOST + '/manager/activities/new' + '?_csrf=' + CSRF_TOKEN['_csrf']
        cases = self.test_cases['test_1_0']
        cookies = SESSION
        self.assert_post(url, cases, cookies, False)

        url = HOST + '/activities?page_no=1&sport=&facility=&start_date=0-1-1&end_date=3000-1-1&no_items=1000'
        result = self.test_cases['test_1_1'][0]['result']
        self.assert_get(url, result, cookies)

    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        pass


if __name__ == '__main__':
    unittest.main()