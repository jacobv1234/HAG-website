"""This file contains functions that relate to
OpenWeather's API. Until a free subscription is
acquired this will generate dummy data."""

class OpenWeather:
    # space for __init__ to load auth key
    def __init__():
        pass

    def reverse_geocoding(long, lat):
        return 'Norwich', 'UK'
    
    def forecast(long, lat, time):
        return {
            'Now': {
                'type':'01d', # the type refers to the icons openweather provide
                'temp':16
            },
            '11am': {
                'type':'01d',
                'temp':16
            },
            '12pm': {
                'type': '02d',
                'temp': 17
            },
            '1pm': {
                'type': '04d',
                'temp': 13
            },
            '2pm': {
                'type': '09d',
                'temp': 9
            },
            '3pm': {
                'type': '09d',
                'temp': 9
            },
            '4pm': {
                'type': '09d',
                'temp': 10
            },
            '5pm': {
                'type': '09d',
                'temp': 10
            },
            '6pm': {
                'type': '04d',
                'temp': 9
            },
            '7pm': {
                'type': '09d',
                'temp': 8
            }
        }