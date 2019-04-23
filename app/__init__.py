import os, sys, configparser
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import consent, experiment, complete, error
from .db import db_check
from .utils import ip2long

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
    session['db']   = os.path.join(ROOT_DIR, cfg['IO']['DB'])
    session['data'] = os.path.join(ROOT_DIR, cfg['IO']['DATA'])
    session['task'] = cfg['IO']['TASK']

    ## Store Turker info.
    session['workerId']     = request.args.get('workerId')
    session['assignmentId'] = request.args.get('assignmentId')
    session['hitId']        = request.args.get('hitId')
    session['ipAddress']    = ip2long(request.remote_addr)

    ## Check database for matches.
    if db_check(session['db'], session['workerId']):
        return redirect(url_for('error.error', errornum=1010))
    else:
        return redirect(url_for('consent.consent'))
