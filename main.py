from flask import Flask, render_template, request, session
import json
from data import accountInfo, accounts
from utils import getter, setter, hash


app = Flask(__name__)
app.secret_key = b'\xfd\xec\x82\x96\x94\xa2\xb0\xd3\xb7\x15\xe0\x8e\xd3\x1c\xb7'

sendMessage = lambda session, message: render_template("base.html", message=message, profile="trash")

@app.route("/")
def main():
    print(f"{accountInfo = }")
    print(f"{accounts = }")
    print(f"{session = }")
    return render_template("main.html", username=session.get("username"))

@app.route("/home")
def home():
    return render_template("home.html", username=session.get("username"), profile=getter(session, "profile"))

@app.route("/lobby")
def lobby():
    return render_template("lobby.html", username=session.get("username"), profile=getter(session, "profile"), users=["shmuli", "chana", "yosef", "jon"][:40])

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

    return sendMessage(session, session, "success")

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == "GET":
        return render_template("signup.html")
    
    data = request.form
    username = data.get("username")
    password = data.get("password")
    
    if username in accounts:
        return sendMessage(session, "this username all ready exists")
    
    lists, listNames, comments = getter(session, "lists", "listNames", "comments")
    
    accounts[username] = password
    accountInfo[username] = {}

    setter(session, "lists", lists)
    setter(session, "listNames", listNames)
    setter(session, "comments", comments)

    session["username"] = username

    return sendMessage(session, f"new user created: {username}")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return render_template("login.html")
    
    data = request.form
    username = data.get("username")
    password = data.get("password")
    

    if username not in accounts:
        return "this user does not exists"

    if accounts[username] != hash(password):
        return "this username all ready exists"
    
    session["username"] = username

    return sendMessage(session, f"you are now logged in as {username}")

@app.route('/logout')
def logout():
    session["username"] = None

    return sendMessage(session, "you are now logged out")


if __name__ == "__main__":
    app.run(debug=True)