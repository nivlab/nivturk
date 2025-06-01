import os, sys, re, configparser, warnings
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import consent, alert, experiment, complete, error
import json
from collections import OrderedDict
from .io import write_metadata
from .utils import gen_code
__version__ = '1.2.6'

## Define root directory.
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Load and parse configuration file.
cfg = configparser.ConfigParser()
cfg.read(os.path.join(ROOT_DIR, 'app.ini'))

## Ensure output directories exist.
data_dir = os.path.join(ROOT_DIR, cfg['IO']['DATA'])
if not os.path.isdir(data_dir): os.makedirs(data_dir)
meta_dir = os.path.join(ROOT_DIR, cfg['IO']['METADATA'])
if not os.path.isdir(meta_dir): os.makedirs(meta_dir)
incomplete_dir = os.path.join(ROOT_DIR, cfg['IO']['INCOMPLETE'])
if not os.path.isdir(incomplete_dir): os.makedirs(incomplete_dir)
reject_dir = os.path.join(ROOT_DIR, cfg['IO']['REJECT'])
if not os.path.isdir(reject_dir): os.makedirs(reject_dir)

code_success = cfg['IO']['CODE_SUCCESS']
code_reject = cfg['IO']['CODE_REJECT']

## Check Flask mode; if debug mode, clear session variable.
debug = True # cfg['FLASK'].getboolean('DEBUG')
if debug:
    warnings.warn("WARNING: Flask currently in debug mode. This should be changed prior to production.")

## Check Flask password.
secret_key = cfg['FLASK']['SECRET_KEY']
if secret_key == "PLEASE_CHANGE_THIS":
    warnings.warn("WARNING: Flask password is currently default. This should be changed prior to production.")

## Check restart mode; if true, participants can restart experiment.
allow_restart = cfg['FLASK'].getboolean('ALLOW_RESTART')

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = secret_key

## Apply blueprints to the application.
app.register_blueprint(consent.bp)
app.register_blueprint(alert.bp)
app.register_blueprint(experiment.bp)
app.register_blueprint(complete.bp)
app.register_blueprint(error.bp)

## Define root node.
@app.route('/')
def login():
    """Display login page"""
    if debug:
        session.clear()

    ## Store directories in session object.
    session['data'] = data_dir
    session['metadata'] = meta_dir
    session['incomplete'] = incomplete_dir
    session['reject'] = reject_dir
    session['allow_restart'] = allow_restart
    session['code_success'] = code_success
    session['code_reject'] = code_reject


    ## Record incoming metadata.
    info = OrderedDict(
        subId        = gen_code(24),                        # gen metadata
        address      = request.remote_addr,                 # addrs metadata
        user_agent   = request.user_agent.string,           # user metadata
        code_success = code_success,
        code_reject  = code_reject,
    )
    
    # Case 2: mobile / tablet / game console user.
    if any([device in info['user_agent'].lower() for device in ['mobile','android','iphone','ipad','kindle','nintendo','playstation','xbox']]):

        ## Redirect participant to error (platform error).
        return redirect(url_for('error.error', errornum=1001))

    ## Case 3: previous complete.
    elif 'complete' in session:

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Update metadata.
    for k, v in info.items(): session[k] = v
   

    return render_template('login.html')
