from flask import Flask, render_template, request, session
import json
from data import accountInfo, accounts
from utils import getter, setter, hash


app = Flask(__name__)
app.secret_key = b'\xfd\xec\x82\x96\x94\xa2\xb0\xd3\xb7\x15\xe0\x8e\xd3\x1c\xb7\x1a'


@app.route("/")
def main():
    return render_template("main.html")

@app.route("/reset")
def reset():
    setter(session, "lists", [[],[],[]])
    setter(session, "listNames", ["todo", "doing", "done"])
    setter(session, "comments", [[], [], []])

    lists, listNames, comments = getter(session, "lists", "listNames", "comments")
    return {"lists": lists, "comments": comments, "listNames": listNames}

@app.route("/data")
def data():
    lists, listNames, comments = getter(session, "lists", "listNames", "comments")
    return {"lists": lists, "comments": comments, "listNames": listNames}

@app.route("/update", methods=["POST"])
def update():
    data = request.json
    setter(session, "lists", data.get("lists"))
    setter(session, "listNames", data.get("listNames"))
    setter(session, "comments", data.get("comments"))

    return "success"






if __name__ == "__main__":
    app.run(debug=True)