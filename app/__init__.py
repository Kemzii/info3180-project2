from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['UPLOAD_FOLDER'] = "./app/static/uploads"

app.config['SQLALCHEMY_DATABASE_URI'] =  "postgresql://project2:testpass@localhost/photogram"
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://oyzjdjrswjhfes:90c3f0501321f13e0c4e7222cfcb4fecc6d590e947202a0309f94313ea72dd36@ec2-23-21-217-27.compute-1.amazonaws.com:5432/dfhol0n5d8ti0p'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)



from app import views