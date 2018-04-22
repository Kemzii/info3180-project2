from flask_wtf import FlaskForm
from wtforms import Form, TextField, TextAreaField, validators, SelectField, PasswordField
from wtforms.validators import DataRequired, Email
from flask_wtf.file import FileField, FileRequired, FileAllowed

class MyForm(FlaskForm):
    username = TextField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    firstname = TextField('First Name', validators=[DataRequired()])
    lastname = TextField('Last Name', validators=[DataRequired()])
    email = TextField('Email', validators=[DataRequired(), Email()])
    location = TextField('Location', validators=[DataRequired()])
    biography = TextAreaField('Biography', validators=[DataRequired()])
    photo = FileField('Photo', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'Images only!'])
    ])
    