import os, sys, configparser, warnings
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import consent, alert, experiment, complete, error
from .io import write_metadata
from .utils import gen_code
__version__ = '0.9.2'

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
reject_dir = os.path.join(ROOT_DIR, cfg['IO']['REJECT'])
if not os.path.isdir(reject_dir): os.makedirs(reject_dir)

## Check Flask password.
if cfg['FLASK']['SECRET_KEY'] == "PLEASE_CHANGE_THIS":
    msg = "WARNING: Flask password is currently default. This should be changed prior to production."
    warnings.warn(msg)

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = cfg['FLASK']['SECRET_KEY']

## Apply blueprints to the application.
app.register_blueprint(consent.bp)
app.register_blueprint(alert.bp)
app.register_blueprint(experiment.bp)
app.register_blueprint(complete.bp)
app.register_blueprint(error.bp)

## Define root node.
@app.route('/')
def index():

    ## Store directories in session object.
    session['data'] = data_dir
    session['metadata'] = meta_dir
    session['reject'] = reject_dir

    ## Record incoming metadata.
    info = dict(
        workerId     = request.args.get('workerId'),        # MTurk metadata
        assignmentId = request.args.get('assignmentId'),    # MTurk metadata
        hitId        = request.args.get('hitId'),           # MTurk metadata
        subId        = gen_code(24),                        # NivTurk metadata
        a            = request.args.get('a'),               # TurkPrime metadata
        tp_a         = request.args.get('tp_a'),            # TurkPrime metadata
        b            = request.args.get('b'),               # TurkPrime metadata
        tp_b         = request.args.get('tp_b'),            # TurkPrime metadata
        c            = request.args.get('c'),               # TurkPrime metadata
        tp_c         = request.args.get('tp_c'),            # TurkPrime metadata
        browser      = request.user_agent.browser,          # User metadata
        platform     = request.user_agent.platform,         # User metadata
        version      = request.user_agent.version,          # User metadata
    )

    ## Case 1: mobile user.
    if info['platform'] in ['android','iphone','ipad','wii']:

        ## Redirect participant to error (admin error).
        return redirect(url_for('error.error', errornum=1001))

    ## Case 2: first visit, workerId absent.
    elif not 'workerId' in session and info['workerId'] is None:

        ## Redirect participant to error (admin error).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 3: first visit, workerId present.
    elif not 'workerId' in session:

        ## Update metadata.
        for k, v in info.items(): session[k] = v
        write_metadata(session, ['workerId','hitId','assignmentId','subId','browser','platform','version'], 'w')

        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))

    ## Case 4: repeat visit, manually changed workerId.
    elif session['workerId'] != info['workerId'] and info['workerId'] is not None:

        ## Update metadata.
        session['ERROR'] = '1002: workerId tampering detected.'
        write_metadata(session, ['ERROR'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1002))

    ## Case 5: all else.
    else:

        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))

## DEV NOTE:
## The following route is strictly for development purpose and should be commented out before deployment.
# @app.route('/clear')
# def clear():
#     session.clear()
#     return 'Complete!'
