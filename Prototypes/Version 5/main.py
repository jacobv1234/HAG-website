# imports - only import what is needed
from flask import Flask, render_template, url_for, request, jsonify
from flask_cors import CORS
from yagmail import SMTP

# local imports
from functions.openweather import OpenWeather
from functions.ambee import Ambee
from functions.defra import get_pollution
from functions.advice import get_advice

ow = OpenWeather()
am = Ambee()

# create the app
app = Flask(__name__)
CORS(app)

# return pages
@app.route('/')
def homepage():
    return render_template('home.html')

@app.route('/blog')
def blogpage():
    return render_template('blog.html')

@app.route('/weather')
def weatherpage():
    return render_template('weather.html')

@app.route('/contact')
def contactpage():
    return render_template('contact.html')

@app.route('/admin')
def adminpage():
    return render_template('admin.html')


# weather page content generation
@app.route('/weather/content', methods=['POST'])
def weather_data_generation():
    # get json body
    values = request.get_json()
    longitude = values['longitude']
    latitude = values['latitude']
    time = values['time']

    # openWeather interactions
    city, country = ow.reverse_geocoding(longitude,latitude)
    forecast = ow.forecast(longitude,latitude,time)

    # Ambee interactions
    pollen = am.get_pollen(longitude,latitude)

    # DEFRA map data
    pollution = get_pollution(longitude, latitude)

    # advice generation
    advice = get_advice(forecast,pollen)

    response = {
        'location': [city,country],
        'forecast': forecast,
        'pollen' : pollen,
        'pollution': pollution,
        'advice' : advice
    }

    return jsonify(response), 200


# send email
@app.route('/contact/send', methods=['POST'])
def send_email():
    # get json body
    data = request.get_json()
    
    # load the email and password from file of the sender
    with open('sender.txt', 'r') as f:
        contents = [line[:-1] for line in f.readlines()]
        email = contents[0]
        passwd = contents[1]
    
    # load the recipient from receiver.txt
    with open('receiver.txt', 'r') as f:
        receiver = f.read()
    
    # formulate email body
    subject = data['subject']
    body = [f"This is {data['name']}. Send replies to {data['reply_email']}.\n\n\n{data['body']}"]

    SMTP(email,passwd).send(receiver, subject, body)

    response = {
        'message' : 'Email sent successfully.'
    }
    return jsonify(response), 201



# check admin password
@app.route('/passcheck',methods=['POST'])
def passcheck():
    # get json body
    data = request.get_json()
    guess_hash = data['hash']

    # load the correct hash
    with open('correct_pass_hash.txt', 'r') as f:
        correct_hash = f.read()
    
    # compare
    if guess_hash == correct_hash:
        message = 'Correct password'
        code = 200
    else:
        message = 'Wrong password'
        code = 401
    
    # send response
    response = {
        'message': message
    }
    return jsonify(response), code


# change admin password
@app.route('/admin/password', methods=['POST'])
def changepass():
    # get json body
    data = request.get_json()
    hash = data['hash']

    # write to the file
    with open('correct_pass_hash.txt', 'w') as f:
        f.write(hash)
    
    # response
    response = {
        'message': 'Password updated successfully'
    }
    return jsonify(response), 201


# change / get contact email
@app.route('/admin/email', methods=['GET','POST'])
def contact_email():
    # get current email
    if request.method == 'GET':
        with open('receiver.txt','r') as f:
            email = f.read()
        response = {
            'email': email 
        }
        return jsonify(response), 200
    
    # update email
    else:
        data = request.get_json()
        with open('receiver.txt','w') as f:
            f.write(data['email'])
        response = {
            'message' : 'Email updated successfully' 
        }
        return jsonify(response), 200


## RUN ##
if __name__ == '__main__':
    app.run('127.0.0.1',8080)