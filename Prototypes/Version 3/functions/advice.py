"""This file will generate the advice for the weather
page. At the moment, it just generates sample advice
based on the other sample data."""

def get_advice(forecast, pollen):
    return [
        {
            'title': 'Cold temperatures soon',
            'description' : 'Wrap up nice and warm! Additionally, maybe stay at home and keep warm with a hot water bottle if you can.'
        },
        {
            'title': 'Raining soon',
            'description' : 'Make sure to wear waterproof clothing, or bring an umbrella! Also, keep in mind that roads can be more slippery when wet.'
        },
        {
            'title': 'High pollen count',
            'description' : 'If you suffer from hay fever, be sure you know the risks and learn to prevent them.'
        }
    ]