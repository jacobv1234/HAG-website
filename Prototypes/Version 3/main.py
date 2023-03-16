# imports - only import what is needed
from flask import Flask, render_template, url_for, request, jsonify
from flask_cors import CORS

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

## RUN ##
if __name__ == '__main__':
    app.run('127.0.0.1',8080)