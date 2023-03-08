# imports - only import what is needed
from flask import Flask, send_from_directory, redirect

# create the app
app = Flask(__name__)

# return pages
@app.route('/',methods=['GET'])
def homepage():
    return send_from_directory('templates/home','index.html')

@app.route('/blog',methods=['GET'])
def blogpage():
    return send_from_directory('templates/blog','index.html')

@app.route('/weather',methods=['GET'])
def weatherpage():
    return send_from_directory('templates/weather','index.html')

@app.route('/contact',methods=['GET'])
def contactpage():
    return send_from_directory('templates/contact','index.html')

@app.route('/admin',methods=['GET'])
def adminpage():
    return send_from_directory('templates/admin','index.html')




## RUN ##
if __name__ == '__main__':
    app.run('127.0.0.1',8080)