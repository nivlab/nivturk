import os, sys, configparser
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import consent, experiment, complete, error

## Define root directory.
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Load and parse configuration file.
cfg = configparser.ConfigParser()
cfg.read(os.path.join(ROOT_DIR, 'app.ini'))

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = cfg['FLASK']['SECRET_KEY']

## Apply blueprints to the application.
app.register_blueprint(consent.bp)
app.register_blueprint(experiment.bp)
app.register_blueprint(complete.bp)
app.register_blueprint(error.bp)

## Define root node.
@app.route('/')
def index():

    ## Store directories in session object.
    session['ROOT_DIR'] = ROOT_DIR
    session['DB_DIR'] = os.path.join(session['ROOT_DIR'], cfg['IO']['DB'])
    session['DATA_DIR'] = os.path.join(session['ROOT_DIR'], cfg['IO']['DATA'])
    session['TASK'] = cfg['IO']['TASK']

    return redirect(url_for('consent.consent'))
