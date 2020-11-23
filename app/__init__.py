import os, sys, configparser, warnings
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import input, consent, experiment, complete, error
from .io import write_metadata
from .utils import gen_code
__version__ = '1.0'

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

## Check Flask mode; if debug mode, clear session variable.
debug = cfg['FLASK'].getboolean('DEBUG')
if debug:
    warnings.warn("WARNING: Flask currently in debug mode. This should be changed prior to production.")

## Check Flask password.
secret_key = cfg['FLASK']['SECRET_KEY']
if secret_key == "PLEASE_CHANGE_THIS":
    warnings.warn("WARNING: Flask password is currently default. This should be changed prior to production.")

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = secret_key

## Apply blueprints to the application.
app.register_blueprint(input.bp)
app.register_blueprint(consent.bp)
app.register_blueprint(experiment.bp)
app.register_blueprint(complete.bp)
app.register_blueprint(error.bp)

## Define root node.
@app.route('/')
def index():

    ## Debug mode: clear session.
    if debug:
        session.clear()

    ## Store directories in session object.
    session['data'] = data_dir
    session['metadata'] = meta_dir
    session['reject'] = reject_dir

    ## Record incoming metadata.
    info = dict(
        workerId     = request.args.get('workerId'),        # Prolific metadata
        subId        = gen_code(24),                        # NivTurk metadata
        address      = request.remote_addr,                 # NivTurk metadata
        browser      = request.user_agent.browser,          # User metadata
        platform     = request.user_agent.platform,         # User metadata
        version      = request.user_agent.version,          # User metadata
        code_success = cfg['CODES'].get('CODE_SUCCESS', gen_code(8).upper()),
        code_reject  = cfg['CODES'].get('CODE_REJECT', gen_code(8).upper()),
    )

    ## Case 1: mobile user.
    if info['platform'] in ['android','iphone','ipad','wii']:

        ## Redirect participant to error (platform error).
        return redirect(url_for('error.error', errornum=1001))

    ## Case 2: workerId absent.
    elif not 'workerId' in session and info['workerId'] is None:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('input.input'))

    ## Case 3: repeat visit, previously completed experiment.
    elif 'complete' in session:

        ## Update metadata.
        session['WARNING'] = "Revisited home."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Case 4: workerId present.
    else:

        ## Update metadata.
        for k, v in info.items(): session[k] = v

        # Check to see whether the input ID duplicates an existing worker ID.
        if info['workerId'] in os.listdir(meta_dir):

            ## Add a warning and print the new metadata to the metadata file.
            session['WARNING'] = "Repeat workerId detected; a new subId was assigned."
            write_metadata(session, ['WARNING', 'workerId','subId','address','browser','platform','version'], 'a')
        else:
            write_metadata(session, ['workerId','subId','address','browser','platform','version'], 'w')


        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))
