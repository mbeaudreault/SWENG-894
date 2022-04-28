import flask
from flask_cors import CORS, cross_origin
import mysql.connector


select_video_query = "SELECT video_info_id FROM video_info WHERE video_url = '"
insert_video_query = "INSERT INTO video_info (video_url) VALUES ('"
select_account_query = "SELECT account_info_id FROM account_info WHERE username = '"
insert_account_query = "INSERT INTO account_info (username) VALUES ('"

app = flask.Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = 'Content-Type'

@app.route('/add-rating', methods=['POST'])
@cross_origin()
def add_rating():
    rating_type = flask.request.args.get('rating-type')
    rating = flask.request.args.get('rating')
    username = flask.request.args.get("username")
    video_url = flask.request.args.get('video-url')
    video_info_id = db_adapter.add_info(video_url, select_video_query, insert_video_query)
    account_info_id = db_adapter.add_info(username, select_account_query, insert_account_query)
    db_adapter.add_rating_info(rating, rating_type, account_info_id, video_info_id)
    return "<h1>data added<h1>"

@app.route('/get-rating', methods=['GET'])
@cross_origin()
def get_rating():
    video_url = flask.request.args.get('video-url')
    rating_info = db_adapter.get_rating_info(video_url)
    return rating_info

@app.route('/get-user-rating', methods=['GET'])
@cross_origin()
def get_user_rating():
    video_url = flask.request.args.get('video-url')
    username = flask.request.args.get("username")
    rating_info = db_adapter.get_user_rating_info(video_url, username)
    return rating_info

@app.route("/get-ratio-diff-from-global", methods=['GET'])
@cross_origin()
def get_ratio_diff_from_global():
    video_url = flask.request.args.get('video-url')
    ratio_diff_from_global = db_adapter.get_analytics_distance_from_mean(video_url)
    return ratio_diff_from_global

@app.route("/get-video-ranking", methods=['GET'])
@cross_origin()
def get_video_ranking():
    video_url = flask.request.args.get('video-url')
    video_ranking = db_adapter.get_video_rank(video_url)
    return video_ranking


@app.route('/', methods=['GET'])
@cross_origin()
def home():
    return "<h1>SWENG 894 database api.</p>"


class database_adapter:
    def __init__(self) -> None:
        self.mycursor = None

    def add_info(self, data, select_query, insert_query):
        self.mycursor.execute(select_query + str(data) + "'")
        data_id = self.mycursor.fetchall()
        if data_id:
            return data_id[0][0]
        else:
            self.mycursor.execute(insert_query + str(data) + "')")
            mydb.commit()
            return self.mycursor.lastrowid

    def add_rating_info(self, rating, rating_type, account_info_id, video_info_id):
        sql_query = "SELECT " + rating_type + ", rating_info_id FROM rating_info WHERE video_info_id = " + str(video_info_id) + " AND account_info_id = " + str(account_info_id)
        self.mycursor.execute(sql_query)
        rating_data = self.mycursor.fetchall()
        if not rating_data:
            query = "INSERT INTO rating_info (account_info_id, video_info_id, " + rating_type  + ") VALUES (" + str(account_info_id) + ", " + str(video_info_id) + ", " + str(rating) + ")"
            self.mycursor.execute(query)
            mydb.commit()
        else:
            if rating == rating_data[0][0]:
                pass
            else:
                self.mycursor.execute("UPDATE rating_info SET " + rating_type + " = " + str(rating) + " WHERE video_info_id = " + str(video_info_id) + " AND account_info_id = " + str(account_info_id))
                mydb.commit()

    def get_rating_info(self, video_url):
        self.mycursor.execute("SELECT COALESCE(SUM(is_liked), 0), " +
                              "COALESCE(SUM(is_disliked), 0), " +
                              "COALESCE(SUM(is_misinformation), 0), " +
                              "COALESCE(SUM(is_did_not_work), 0), " +
                              "COALESCE(SUM(is_outdated), 0), " +
                              "COALESCE(SUM(is_offensive), 0), " +
                              "COALESCE(SUM(is_immoral), 0) FROM rating_info INNER JOIN video_info on rating_info.video_info_id = video_info.video_info_id WHERE video_info.video_url = '" + video_url + "';")
        rating_data = self.mycursor.fetchall()
        print(rating_data)
        mydb.commit()
        rating_dict = {"is_liked": rating_data[0][0],
                       "is_disliked": rating_data[0][1],
                       "is_misinformation": rating_data[0][2],
                       "is_did_not_work": rating_data[0][3],
                       "is_outdated": rating_data[0][4],
                       "is_offensive": rating_data[0][5],
                       "is_immoral": rating_data[0][6]}
        print(rating_dict)
        return rating_dict

    def get_user_rating_info(self, video_url, username):
        self.mycursor.execute("SELECT COALESCE(is_liked, 0), COALESCE(is_disliked, 0), " +
                              "COALESCE(is_misinformation, 0), COALESCE(is_did_not_work, 0), " +
                              "COALESCE(is_outdated, 0), COALESCE(is_offensive, 0), " +
                              "COALESCE(is_immoral, 0) FROM rating_info INNER JOIN video_info " +
                              "ON rating_info.video_info_id = video_info.video_info_id " +
                              "INNER JOIN account_info ON account_info.account_info_id = rating_info.account_info_id " +
                              "WHERE video_info.video_url = '" + video_url + "' AND account_info.username = '" + username + "';")
        rating_data = self.mycursor.fetchall()
        print(rating_data)
        mydb.commit()
        try: 
            rating_dict = {"is_liked": rating_data[0][0],
                        "is_disliked": rating_data[0][1],
                        "is_misinformation": rating_data[0][2],
                        "is_did_not_work": rating_data[0][3],
                        "is_outdated": rating_data[0][4],
                        "is_offensive": rating_data[0][5],
                        "is_immoral": rating_data[0][6]}
        except IndexError:
            rating_dict = {"is_liked": 0,
                        "is_disliked": 0,
                        "is_misinformation": 0,
                        "is_did_not_work": 0,
                        "is_outdated": 0,
                        "is_offensive": 0,
                        "is_immoral": 0}
        return rating_dict

    def get_analytics_distance_from_mean(self, video_url):
        self.mycursor.execute("SELECT SUM(is_liked)/COUNT(rating_info.video_info_id) as likeRatio, " +
                              "SUM(is_disliked)/COUNT(rating_info.video_info_id) as dislikeRatio, " +
                              "SUM(is_misinformation)/COUNT(rating_info.video_info_id) as misinformationRatio, " +
                              "COALESCE(SUM(is_did_not_work)/COUNT(rating_info.video_info_id), 0) as didNotWorkRatio, " +
                              "SUM(is_outdated)/COUNT(rating_info.video_info_id) as outdatedRatio, " +
                              "SUM(is_offensive)/COUNT(rating_info.video_info_id) as offensiveRatio, " +
                              "SUM(is_immoral)/COUNT(rating_info.video_info_id) as immoralRatio " +
                              "FROM rating_info;")
        globalRatioRatings = self.mycursor.fetchall()
        self.mycursor.execute("SELECT COALESCE(SUM(is_liked)/COUNT(rating_info.video_info_id), 0) as likeRatio, " +
                              "COALESCE(SUM(is_disliked)/COUNT(rating_info.video_info_id), 0) as dislikeRatio, " +
                              "COALESCE(SUM(is_misinformation)/COUNT(rating_info.video_info_id), 0) as misinformationRatio, " +
                              "COALESCE(SUM(is_did_not_work)/COUNT(rating_info.video_info_id), 0) as didNotWorkRatio, " +
                              "COALESCE(SUM(is_outdated)/COUNT(rating_info.video_info_id), 0) as outdatedRatio, " +
                              "COALESCE(SUM(is_offensive)/COUNT(rating_info.video_info_id), 0) as offensiveRatio, " +
                              "COALESCE(SUM(is_immoral)/COUNT(rating_info.video_info_id), 0) as immoralRatio " +
                              "FROM rating_info INNER JOIN video_info on rating_info.video_info_id = video_info.video_info_id " +
                              "WHERE video_info.video_url = '" + video_url + "';")
        specificRatioRatings = self.mycursor.fetchall()
        mydb.commit()


        ratio_diff_from_global= {"is_liked": round(specificRatioRatings[0][0] - globalRatioRatings[0][0], 2),
                                 "is_disliked": round(specificRatioRatings[0][1] - globalRatioRatings[0][1], 2),
                                 "is_misinformation": round(specificRatioRatings[0][2] - globalRatioRatings[0][2], 2),
                                 "is_did_not_work": round(specificRatioRatings[0][3] - globalRatioRatings[0][3], 2),
                                 "is_outdated": round(specificRatioRatings[0][4] - globalRatioRatings[0][4], 2),
                                 "is_offensive": round(specificRatioRatings[0][5] - globalRatioRatings[0][5], 2),
                                 "is_immoral": round(specificRatioRatings[0][6] - globalRatioRatings[0][6], 2)}
        return ratio_diff_from_global

    def get_video_rank(self, video_url):
        self.mycursor.execute("SELECT (coalesce(SUM(is_liked)/COUNT(rating_info.video_info_id),0) - " +
	                          "coalesce((is_disliked)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce(SUM(is_misinformation)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce((is_did_not_work)/COUNT(rating_info.video_info_id), 0) - " +
                              "coalesce(SUM(is_outdated)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce(SUM(is_offensive)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce(SUM(is_immoral)/COUNT(rating_info.video_info_id), 0)) as overallRating " +
                              "FROM rating_info INNER JOIN video_info on rating_info.video_info_id = video_info.video_info_id " +
                              "GROUP BY video_info.video_info_id;")
        video_rank_values = self.mycursor.fetchall()
        self.mycursor.execute("SELECT (coalesce(SUM(is_liked)/COUNT(rating_info.video_info_id),0) - " +
	                          "coalesce((is_disliked)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce(SUM(is_misinformation)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce((is_did_not_work)/COUNT(rating_info.video_info_id), 0) - " +
                              "coalesce(SUM(is_outdated)/COUNT(rating_info.video_info_id),0) - " +
                              "coalesce(SUM(is_offensive)/COUNT(rating_info.video_info_id),0) -  " +
                              "coalesce(SUM(is_immoral)/COUNT(rating_info.video_info_id), 0)) as overallRating " +
                              "FROM rating_info INNER JOIN video_info on rating_info.video_info_id = video_info.video_info_id " +
                              "WHERE video_info.video_url = '" + video_url + "';")
        specific_rank_value = self.mycursor.fetchall()
        mydb.commit()

        rankings = self.sort_video_by_rating(video_rank_values)

        return {'ranking': self.get_video_ranking(rankings, specific_rank_value)}

    def get_video_ranking(self, rankings, target_ranking):
        print(target_ranking[0], rankings)
        if target_ranking[0] not in rankings:
            return self.get_video_ranking_outside(rankings, target_ranking)
        while len(rankings) >= 1:
            if rankings[len(rankings) // 2][0] > target_ranking[0][0]:
                return self.get_video_ranking(rankings[len(rankings) // 2:], target_ranking)
            elif rankings[len(rankings) // 2][0] < target_ranking[0][0]:
                return self.get_video_ranking(rankings[:len(rankings) // 2], target_ranking)
            elif rankings[len(rankings) // 2][0] == target_ranking[0][0]:
                return (len(rankings) // 2) + 1
        return -1

    def get_video_ranking_outside(self, rankings, target_ranking):
        i = 0
        try:
            while target_ranking[0][0] < rankings[i][0]:
                i += 1
            return i + 1
        except IndexError:
            return i + 2

    def sort_video_by_rating(self, video_rank_values):
        temp = []
        for i in range(len(video_rank_values)):
            j = 0
            try:
                while video_rank_values[i] < temp[j]:
                    j += 1
                temp.insert(j, video_rank_values[i])
            except IndexError:
                temp.append(video_rank_values[i])
        return temp
            

    def set_mycursor(self, new_cursor):
        self.mycursor = new_cursor


db_adapter = database_adapter()
mydb = None
if __name__ == "__main__":
    mydb = mysql.connector.connect(
    host="localhost",
    user="apiuser",
    password="password",
    database="sweng894"
    )
    mycursor = mydb.cursor()
    db_adapter.set_mycursor(mycursor)
    app.run()
