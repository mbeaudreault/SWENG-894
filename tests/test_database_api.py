import os
import tempfile
import sys
import pytest


import database_api.api


class mock_db:
    def __init__(self):
        pass

    def commit(self):
        pass


class mock_cursor:
    def __init__(self):
        self.last_query = []
        self.lastrowid = None

    def execute(self, query):
        self.last_query.append(query)
        self.lastrowid = query

    def fetchall(self):
        return [self.last_query]


def test_add_info():
    mc = mock_cursor()
    database_api.api.db_adapter.set_mycursor(mc)
    last_query = database_api.api.db_adapter.add_info('test_data', 'test_select_query', 'test_insert_query')
    assert last_query == "test_select_querytest_data'"

def test_add_rating_info():
    mc = mock_cursor()
    database_api.api.db_adapter.set_mycursor(mc)
    database_api.api.mydb = mock_db()
    database_api.api.db_adapter.add_rating_info('test_data', 'test_type', 2, 1)
    assert mc.last_query[0] == "SELECT test_type, rating_info_id FROM rating_info WHERE video_info_id = 1 AND account_info_id = 2"
    assert mc.last_query[1] == 'UPDATE rating_info SET test_type = test_data WHERE video_info_id = 2 AND account_info_id = 1'