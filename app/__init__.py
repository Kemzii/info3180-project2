from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_jwt import JWT

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['UPLOAD_FOLDER'] = "./app/static/uploads"

#app.config['SQLALCHEMY_DATABASE_URI'] =  "postgresql://project2:testpass@localhost/photogram"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://fkyucjkaqzudln:c2c63a198e8b77be78d87b9266db6498b1b15bea852a351a92b9fcfaad7495ac@ec2-54-225-200-15.compute-1.amazonaws.com:5432/dfac4sn6gea87e'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message_category = "info"

app.config.from_object(__name__)



from app import views