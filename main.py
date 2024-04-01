from flask import Flask, render_template, request, session
import json


app = Flask(__name__)


@app.route("/")
def main():
    return render_template("main.html")

@app.route("/data")
def data():
    print(f'this is the data api: {userData["shmuli"]["lists"] = }{userData["shmuli"]["comments"] = }{userData["shmuli"]["listNames"] = }')

    return {'lists': userData["shmuli"]["lists"], 'listNames': userData["shmuli"]["listNames"], "comments": userData["shmuli"]["comments"]}

@app.route("/update", methods=["POST"])
def update():
    data = request.json
    userData["shmuli"]["lists"] = data.get("lists")
    userData["shmuli"]["comments"] = data.get("comments")
    userData["shmuli"]["listNames"] = data.get("listNames")


    print(f'{userData["shmuli"]["lists"] = }{userData["shmuli"]["comments"] = }{userData["shmuli"]["listNames"] = }')

    return "success"





userData = {
    "shmuli": {"lists": [[],[],[]], "listNames": ["todo", "doing", "done"], "comments": [[[]], [[]], [[]]]}
}
if __name__ == "__main__":
    app.run(debug=True)