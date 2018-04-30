from . import db
from werkzeug.security import generate_password_hash
class Users(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    firstname = db.Column(db.String(80))
    lastname = db.Column(db.String(80))
    email = db.Column(db.String(80))
    location = db.Column(db.String(80))
    biography = db.Column(db.String(80))
    profile_photo = db.Column(db.String(255))
    joined_on = db.Column(db.String(80))
    
    def __init__(self, password, **kwargs):
        super(Users, self).__init__(**kwargs)
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
    
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.firstname)


class Posts(db.Model):
    __tablename__ = 'posts'
    
    postid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    photo = db.Column(db.String(255))
    caption = db.Column(db.String(80))
    created_on = db.Column(db.String(80))

    def get_id(self):
        try:
            return unicode(self.postid)  # python 2 support
        except NameError:
            return str(self.postid)  # python 3 support

class Likes(db.Model):
    __tablename__ = 'likes'
    
    likeid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.postid'))


    def get_id(self):
        try:
            return unicode(self.likeid)  # python 2 support
        except NameError:
            return str(self.likeid)  # python 3 support

class Follows(db.Model):
    __tablename__ = 'follows'
    
    followid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    follower_id = db.Column(db.Integer)
    
    def get_id(self):
        try:
            return unicode(self.followid)  # python 2 support
        except NameError:
            return str(self.followid)  # python 3 support


