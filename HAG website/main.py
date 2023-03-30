# imports - only import what is needed for security
# while url_for is not directly used in this file it is imported so the HTML files can use it
# so the HTML files can use it to connect to CSS and JS files
from flask import Flask, render_template, url_for, request, jsonify
from flask_cors import CORS
from yagmail import SMTP
from json import dumps, loads
from os import listdir

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

@app.route('/blog/view/<id>')
def viewpage(id): # the argument is not used but is there so that <id> in the URL can be anything
    return render_template('view.html')


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


# blog post creation
@app.route('/admin/create', methods=['POST'])
def create_post():
    blog_json = request.get_json()
    timestamp = blog_json['timestamp']
    # create blog file
    with open(f'static/blog/{timestamp}.json', 'w') as f:
        f.write(dumps(blog_json))
    
    # response
    response = {
        'message': 'Blog post created successfully.'
    }
    return jsonify(response), 201


# gets all blog posts in reverse release order
@app.route('/blog/all', methods=['GET'])
def load_blogs():
    # get a list of all files
    posts = listdir('static/blog')
    posts.sort()
    # display them in console for debug
    print(f'Contents of static/blog: {posts}')

    # for each one load it and store the contents in all_posts
    # which is a list so they stay in the correct order when sent
    all_posts = []
    for post_name in posts:
        with open(f'static/blog/{post_name}', 'r') as f:
            post_str = f.read()
        
        post_json = loads(post_str)
        all_posts.append(post_json)
    
    # newest first
    all_posts.reverse()

    # response
    response = {
        'all_posts': all_posts
    }
    return jsonify(response), 200


# gets just the most recent blog post to save on transfer time
# this function is very similar to the above one but without the loop
@app.route('/lastblog', methods=['GET'])
def last_blog():
    # get a list of all files
    posts = listdir('static/blog')
    posts.sort()
    # display them in console for debug
    print(f'Contents of static/blog: {posts}')

    # get contents of most recent
    with open(f'static/blog/{posts[-1]}', 'r') as f:
        post_str = f.read()
    
    # response - directly send the blog json so less indexing problems at the other end
    response = loads(post_str)
    return jsonify(response), 200


# gets a specific blog post
# very similar to the above but after a specific value instead of the last one
# so it doesn't need to list all of the options
@app.route('/getblog/<id>', methods=['GET'])
def specific_blog(id):
    # get contents of correct post
    with open(f'static/blog/{id}.json', 'r') as f:
        post_str = f.read()
    
    # response - directly send the blog json so less indexing problems at the other end
    response = loads(post_str)
    return jsonify(response), 200



## RUN ##
if __name__ == '__main__':
    app.run('127.0.0.1',8080)