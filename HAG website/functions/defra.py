"""This file contains functions that relate to
DEFRA map data. This returns dummy data for now, but
will use actual data via Pandas once downloaded"""

def get_pollution(long, lat):
    return [
        {
            'year': 2021, # this is the newest publicly available data
            'value': 0.808
        },
        {
            'year': 2020, 
            'value': 0.917
        },
        {
            'year': 2019, 
            'value': 0.902
        },
        {
            'year': 2018, 
            'value': 1.024
        },
        {
            'year': 2017, 
            'value': 1.056
        },
    ]