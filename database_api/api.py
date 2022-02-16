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
        self.mycursor.execute("SELECT " + rating_type + ", rating_info_id FROM rating_info WHERE video_info_id = " + str(video_info_id) + " AND account_info_id = " + str(account_info_id))
        rating_data = self.mycursor.fetchall()
        if not rating_data:
            query = "INSERT INTO rating_info (account_info_id, video_info_id, " + rating_type  + ") VALUES (" + str(account_info_id) + ", " + str(video_info_id) + ", " + str(rating) + ")"
            self.mycursor.execute(query)
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
        mydb.commit()
        rating_dict = {"is_liked": rating_data[0][0],
                       "is_disliked": rating_data[0][1],
                       "is_misinformation": rating_data[0][2],
                       "is_did_not_work": rating_data[0][3],
                       "is_outdated": rating_data[0][4],
                       "is_offensive": rating_data[0][5],
                       "is_immoral": rating_data[0][6]}
        return rating_dict

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
