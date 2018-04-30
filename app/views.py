"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os, uuid, time, psycopg2, random, jwt, base64
from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, session, abort, jsonify, _request_ctx_stack, g
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, current_user, login_required
from functools import wraps

from forms import RegForm, LoginForm, PostForm
from models import Users, Posts, Likes, Follows
###
# Routing for your application.
###

@app.route('/')
def home():
    """Render website's home page with vuejs."""
    return render_template('home.html')
    
# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, app.config['SECRET_KEY'])

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated





@app.route("/api/auth/login", methods=["GET", "POST"])
def login():
    """Render the website's login page."""
    myform = LoginForm()
    if request.method == "POST" and myform.validate_on_submit():
       
        username=myform.username.data
        password=myform.password.data
        
        # using your model, query database for a user based on the username
        # and password submitted
        # store t3he result of that query to a `user` variable so it can be
        # passed to the login_user() method.
        user = Users.query.filter_by(username=username).first()
        
        if user is not None and check_password_hash(user.password, password):
            # If the user is not blank, meaning if a user was actually found,
            # then login the user and create the user session.
            # user should be an instance of your `User` class
           
            payload = {'current_user' : user.id}
            token  = jwt.encode({'user': user.username},app.config['SECRET_KEY'],algorithm = 'HS256')
            session['current_user'] = user.id;
            msg = {"message": "Login Successful!",'token':token,'current_user':user.id}
            login_user(user)
            next_page = request.args.get('next')
            
            #return redirect(next_page or url_for('home'))
            return jsonify(msg)
        
        msg = {"message": "Username or Password is incorrect."}
        return jsonify(msg)

    return jsonify(errors=form_errors(myform))
   

@app.route("/api/auth/logout", methods=['GET'])
@requires_auth
def logout():
    """ Log out user """
    if request.method == 'GET':
        # Logout the user and end the session
        logout_user()
        msg = {"message": "You have been logged out."}
        return jsonify(msg)
    return jsonify({"message": "Bad Request"})
    
    
    
@app.route("/api/users/<user_id>/posts", methods=['GET', 'POST'])
@requires_auth
def posts(user_id):
    """Render the user's posts."""
    myform = PostForm()
    cid = session['current_user']
    if request.method == 'GET':
         
        user = Users.query.filter_by(id= cid).first()
        data={'id':user.id,'username':user.username,'firstname':user.firstname,'lastname':user.lastname,'location':user.location,'profile_photo':'/static/uploads/'+user.profile_photo,'biography':user.biography,'joined':user.joined_on}
        
        
        posts  = Posts.query.filter_by(user_id = cid).all()
        follows=Follows.query.filter_by(user_id=cid).all()
        following=Follows.query.filter_by(follower_id=session['userid'], user_id=uid).first()
        isfollowing=''
        if following is None:
            isfollowing='No'
        else:
            isfollowing='Yes'

        return jsonify(user = cid, response=[{'posts':[postinfo(posts)],'postamt':len(posts),'follows':len(follows),'data':data,'following':isfollowing}])

    elif request.method == 'POST' and myform.validate_on_submit():
        
        user = Users.query.filter_by(id = user_id).first()
        
        photo   = myform.photo.data
        caption  = myform.caption.data
        user_id = user_id
        postid = random.getrandbits(16) 
        
        filename = secure_filename(photo.filename)
        post = Posts(postid=postid, user_id = user_id, photo = filename, caption = caption, created_on = format_date_joined())
        
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        db.session.add(post)
        db.session.commit()

        return jsonify({'message':'Post successfully created'})
        
    return jsonify({"message": "Bad Request"})
    


@app.route('/api/users/register', methods=['GET', 'POST'])
def register():
    """Render the website's registration page."""
    
    myform = RegForm()
    
    if request.method == 'POST' and myform.validate_on_submit():
        
        username = myform.username.data
        password = myform.password.data
        
        firstname = myform.firstname.data
        lastname = myform.lastname.data
        email = myform.email.data
        location = myform.location.data
        biography = myform.biography.data
        profile_photo = myform.photo.data
       
        filename = secure_filename(profile_photo.filename)
        profile_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        id = random.getrandbits(16) 
        joined_on = format_date_joined()
        
        db.create_all()
        db.session.commit()
 
        
        new_user = Users(id=id, username=username, password=password, firstname=firstname, lastname=lastname, email=email, location=location, biography=biography, profile_photo=filename, joined_on=joined_on)
        db.session.add(new_user)
        db.session.commit()
        msg = { "message": "Registration Successful!" }
        return jsonify(msg)
    return jsonify(errors=form_errors(myform))
    
    
@app.route("/api/posts", methods= ['GET'])
@requires_auth
def allposts():
    """Return all posts for all users"""
    if request.method == 'GET':
        
        posts=Posts.query.order_by(Posts.created_on.desc()).all()
        return jsonify(response=[{"posts":postinfo(posts)}])
        
    return jsonify(['Bad Request'])
    
    
@app.route("/api/users/<user_id>/follow", methods= ['POST'])
@requires_auth
def follow(user_id):
    """ Follow a user"""
    user = Users.query.filter_by(id = user_id).first()
    
    if request.method == 'POST':
        
        follow = Follows(user_id, session['current_user'])
        
        db.session.add(follow)
        db.session.commit
        follows = len(Follows.query.filter_by(user_id = user_id).all())

        msg = {"message": "User Followed!", "Followers": follows}
        return jsonify(msg)
    return jsonify(["Bad Request"])
    

@app.route("/api/users/<post_id>/like", methods= ['POST'])
@requires_auth
def like(post_id):
    """ Like a post """
    
    post = Posts.query.filter_by(postid = post_id).first()
    
    if request.method == 'POST':
        
        like = Likes(session['current_user'],post_id)
        
        db.session.add(like)
        db.session.commit
        likes = len(Likes.query.filter_by(post_id = post_id).all())
        msg = {"message": "Post Liked!", "Likes": likes}
        return jsonify(msg)
    return jsonify(["Bad Request"])
    
    
@app.route('/api/users/<user_id>',methods = ['GET'])
@requires_auth
def get_user(user_id):
    """Returns user profile info"""
    cid = session['current_user']
    user = Users.query.filter_by(id= cid).first()

    if user == None:
        return jsonify(['User does not exist'])

    if request.method == 'GET':
        
        data={'id':user.id,'username':user.username,'firstname':user.firstname,'lastname':user.lastname,'location':user.location,'profile_photo':'/static/uploads/'+user.profile_photo,'biography':user.biography,'joined':user.joined_on}
        
        
        posts  = Posts.query.filter_by(user_id = cid).all()
        follows=Follows.query.filter_by(user_id=cid).all()
        following=Follows.query.filter_by(follower_id=session['current_user'], user_id=cid).first()
        isfollowing=''
        if following is None:
            isfollowing='No'
        else:
            isfollowing='Yes'

        return jsonify(user = cid, response=[{'posts':[postinfo(posts)],'postamt':len(posts),'follows':len(follows),'data':data,'following':isfollowing}])

    return jsonify(['Only GET requests are accepted'])


@login_manager.user_loader
def load_user(id):
    
    myform = LoginForm()
    username=myform.username.data
    
    user = Users.query.filter_by(username=username).first()
    if not user:
        return None
    return Users.query.get(int(id))
    
    
    
def postinfo(posts):
    likes='';
    newposts=[]
    for i in range (0,len(posts)):
        user=Users.query.filter_by(id=posts[i].user_id).first();
        username=user.username;
        profile_photo=user.profile_photo;
        liked=Likes.query.filter_by(post_id=posts[i].postid,user_id=session['current_user']).first()
        if liked is None:
            l='No'
        else:
            l='Yes'
        x={
        'id':posts[i].postid,
        'user_id':posts[i].user_id,
        'photo':"/static/uploads/"+posts[i].photo,
        'caption':posts[i].caption,
        'created_on':posts[i].created_on,
        'likes':likeamt(posts[i].postid),
        'username':username,
        'userphoto':'/static/uploads/'+profile_photo,
        'likes':l
        }
        newposts.append(x)
    return newposts
    
def likeamt(post_id):
    count=Likes.query.filter_by(post_id=post_id).all()
    return len(count)

    
   
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
