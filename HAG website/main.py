# imports - only import what is needed
from flask import Flask, render_template, url_for, request, jsonify
from flask_cors import CORS

# local imports
from functions.openweather import OpenWeather as ow


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

    response = {
        'location': [city,country],
        'forecast': forecast
    }

    return jsonify(response), 200

## RUN ##
if __name__ == '__main__':
    app.run('127.0.0.1',8080)