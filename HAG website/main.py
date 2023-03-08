# imports - only import what is needed
from flask import Flask, render_template, url_for

# create the app
app = Flask(__name__)

# return pages
@app.route('/',methods=['GET'])
def homepage():
    return render_template('/home/index.html')

@app.route('/blog',methods=['GET'])
def blogpage():
    return render_template('/blog/index.html')

@app.route('/weather',methods=['GET'])
def weatherpage():
    return render_template('/weather/index.html')

@app.route('/contact',methods=['GET'])
def contactpage():
    return render_template('/contact/index.html')

@app.route('/admin',methods=['GET'])
def adminpage():
    return render_template('/admin/index.html')




## RUN ##
if __name__ == '__main__':
    app.run('127.0.0.1',8080)