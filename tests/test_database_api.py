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
    assert mc.last_query[1] == 'UPDATE rating_info SET test_type = test_data WHERE video_info_id = 1 AND account_info_id = 2'

def test_get_rating_info():
    mc = mock_cursor()
    database_api.api.db_adapter.set_mycursor(mc)
    database_api.api.mydb = mock_db()
    try:
        database_api.api.db_adapter.get_rating_info("test1")
    except (IndexError):
        pass
    assert mc.last_query[0] == "SELECT COALESCE(SUM(is_liked), 0), COALESCE(SUM(is_disliked), 0), COALESCE(SUM(is_misinformation), 0), " +\
                               "COALESCE(SUM(is_did_not_work), 0), COALESCE(SUM(is_outdated), 0), COALESCE(SUM(is_offensive), 0), " +\
                               "COALESCE(SUM(is_immoral), 0) FROM rating_info INNER JOIN video_info " +\
                               "on rating_info.video_info_id = video_info.video_info_id WHERE video_info.video_url = 'test1';"

def test_get_user_rating_info():
    mc = mock_cursor()
    database_api.api.db_adapter.set_mycursor(mc)
    database_api.api.mydb = mock_db()
    try:
        database_api.api.db_adapter.get_user_rating_info("testURL1", "testUsername1")
    except (IndexError):
        pass
    assert mc.last_query[0] == "SELECT COALESCE(is_liked, 0), COALESCE(is_disliked, 0), COALESCE(is_misinformation, 0), " +\
                               "COALESCE(is_did_not_work, 0), COALESCE(is_outdated, 0), COALESCE(is_offensive, 0), " +\
                               "COALESCE(is_immoral, 0) FROM rating_info INNER JOIN video_info " +\
                               "ON rating_info.video_info_id = video_info.video_info_id " +\
                               "INNER JOIN account_info ON account_info.account_info_id = rating_info.account_info_id " +\
                               "WHERE video_info.video_url = 'testURL1' AND account_info.username = 'testUsername1';"

def test_get_analytics_distance_from_mean():
    mc = mock_cursor()
    database_api.api.db_adapter.set_mycursor(mc)
    database_api.api.mydb = mock_db()
    try:
        database_api.api.db_adapter.get_analytics_distance_from_mean("testVid")
    except (IndexError, TypeError):
        pass
    assert mc.last_query[1] == "SELECT COALESCE(SUM(is_liked)/COUNT(rating_info.video_info_id), 0) as likeRatio, " +\
                               "COALESCE(SUM(is_disliked)/COUNT(rating_info.video_info_id), 0) as dislikeRatio, " +\
                               "COALESCE(SUM(is_misinformation)/COUNT(rating_info.video_info_id), 0) as misinformationRatio, " +\
                               "COALESCE(SUM(is_did_not_work)/COUNT(rating_info.video_info_id), 0) as didNotWorkRatio, " +\
                               "COALESCE(SUM(is_outdated)/COUNT(rating_info.video_info_id), 0) as outdatedRatio, " +\
                               "COALESCE(SUM(is_offensive)/COUNT(rating_info.video_info_id), 0) as offensiveRatio, " +\
                               "COALESCE(SUM(is_immoral)/COUNT(rating_info.video_info_id), 0) as immoralRatio " +\
                               "FROM rating_info INNER JOIN video_info on rating_info.video_info_id = video_info.video_info_id " +\
                               "WHERE video_info.video_url = 'testVid';"

# add to command prompt if import error set PYTHONPATH=%PYTHONPATH%;C:\Users\bougi\OneDrive\Documents\Grad School\SWENG 894