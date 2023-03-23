"""This file contains functions that relate to
Ambee's API. Until a subscription is
acquired this will generate dummy data.

Subscriptions are not free, however after talking
to Ambee's support team they have agreed to give me
5000 free requests that last until August, which is 
long enough for this project to be graded."""

class Ambee:
    # space for __init__ to load auth key
    def __init__(self):
        pass

    def get_pollen(self, long, lat):
        return {
            'grass' : 2,
            'trees' : 120,
            'weeds' : 90
        }