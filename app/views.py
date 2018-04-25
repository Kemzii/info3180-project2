"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os, uuid, time, psycopg2, random
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, session, abort, jsonify
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, current_user, login_required

from forms import RegForm, LoginForm
from models import Users, Posts, Likes, Follows
###
# Routing for your application.
###

@app.route('/')
def home():
    """Render website's home page with vuejs."""
    return render_template('home.html')


@app.route("/api/auth/login", methods=["GET", "POST"])
def login():
    """Render the website's login page."""
    myform = LoginForm()
    if request.method == "POST" and myform.validate_on_submit():
       
        if myform.username.data:
            # Get the username and password values from the form.
            username=myform.username.data
            password=myform.password.data
            
            # using your model, query database for a user based on the username
            # and password submitted
            # store t3he result of that query to a `user` variable so it can be
            # passed to the login_user() method.
            user = Users.query.filter_by(username=username).first()
            
            # get user id, load into session
            login_user(user)

            # remember to flash a message to the user
            msg = "Login Successful"
            return jsonify (msg)
    else:
            msg = 'Username or Password is incorrect.'
            return jsonify(msg, errors = form_errors(myform))
            
   

@app.route("/api/auth/logout")
@login_required
def logout():
    if request.method == 'GET':
        # Logout the user and end the session
        logout_user()
        msg = 'You have been logged out.'
        return jsonify(msg)
    return jsonify("Bad Request")


@app.route('/api/users/register', methods=['GET', 'POST'])
def register():
    """Render the website's registration page."""
    
    myform = RegForm()
    
    if request.method == 'POST' and myform.validate_on_submit():
        
        username = myform.username.data
        password = generate_password_hash(myform.password.data)
        firstname = myform.firstname.data
        lastname = myform.lastname.data
        email = myform.email.data
        location = myform.location.data
        biography = myform.biography.data
        profile_photo = myform.photo.data
       
        filename = secure_filename(profile_photo.filename)
        profile_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        userid = random.getrandbits(16) 
        joined_on = format_date_joined()
        
        db.create_all()
        db.session.commit()
 
        
        new_user = Users(userid=userid, username=username, password=password, firstname=firstname, lastname=lastname, email=email, location=location, biography=biography, profile_photo=filename, joined_on=joined_on)
        db.session.add(new_user)
        db.session.commit()
        
        msg = { "message": "Registration Successful!" }
        return jsonify(msg)
    return jsonify(errors=form_errors(myform))
    
    
@app.route("/api/posts", methods= ['GET'])
@login_required
def posts():
    """Return all posts for all users"""
    if request.method == 'GET':
        
        posts = Posts.query.all()
        listposts = [ dlist(posts) for post in posts]
        
        return jsonify({'POSTS':listposts})
    return jsonify(['Only GET requests are accepted'])
    
    
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###
def format_date_joined():
    """format date"""
    dtime = time.strftime("%B %d, %Y")
    return dtime

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages
    
def jsonerrors(errors):

    """Return json errors"""
    errors_list = []
    for error in errors:
        errors_list.append(dict({'error':error}))
    return jsonify({'Errors':errors_list})    
    
    
def dlist(data_object):

    """Returns a dictionary list"""
    
    key_value_pairs   = data_object.__dict__.items()
    object_dictionary = {}

    for key,value in key_value_pairs:
        if not key == '_sa_instance_state':
        #All db ojects will have this but we do not need it here
        # for example: ('_sa_instance_state', <sqlalchemy.orm.state.InstanceState object at 0x7f6696d831d0>)
            object_dictionary[key] = value
    return object_dictionary

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
