import os, sys, re, configparser, warnings
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import consent, alert, experiment, complete, error
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

## Check Flask mode; if debug mode, clear session variable.
debug = cfg['FLASK'].getboolean('DEBUG')
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
def index():

    ## Debug mode: clear session.
    if debug:
        session.clear()

    ## Store directories in session object.
    session['data'] = data_dir
    session['metadata'] = meta_dir
    session['incomplete'] = incomplete_dir
    session['reject'] = reject_dir
    session['allow_restart'] = allow_restart

    ## Record incoming metadata.
    info = dict(
        workerId     = request.args.get('workerId'),        # MTurk metadata
        assignmentId = request.args.get('assignmentId'),    # MTurk metadata
        hitId        = request.args.get('hitId'),           # MTurk metadata
        subId        = gen_code(24),                        # NivTurk metadata
        address      = request.remote_addr,                 # NivTurk metadata
        user_agent   = request.user_agent.string,           # User metadata
        code_success = cfg['CLOUDRESEARCH'].get('CODE_SUCCESS', gen_code(8).upper()),
        code_reject  = cfg['CLOUDRESEARCH'].get('CODE_REJECT', gen_code(8).upper()),
    )

    ## Case 1: workerId absent form URL.
    if info['workerId'] is None:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 2: mobile / tablet / game console user.
    elif any([device in info['user_agent'].lower() for device in ['mobile','android','iphone','ipad','kindle','nintendo','playstation','xbox']]):

        ## Redirect participant to error (platform error).
        return redirect(url_for('error.error', errornum=1001))

    ## Case 3: previous complete.
    elif 'complete' in session:

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Case 4: repeat visit, manually changed workerId.
    elif 'workerId' in session and session['workerId'] != info['workerId']:

        ## Update metadata.
        session['ERROR'] = '1005: workerId tampering detected.'
        session['complete'] = 'error'
        write_metadata(session, ['ERROR','complete'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

    ## Case 5: repeat visit, preexisting activity.
    elif 'workerId' in session:

        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))

    ## Case 6: repeat visit, preexisting log but no session data.
    elif not 'workerId' in session and info['workerId'] in os.listdir(meta_dir):

        ## Parse log file.
        with open(os.path.join(session['metadata'], info['workerId']), 'r') as f:
            logs = f.read()

        ## Extract subject ID.
        info['subId'] = re.search('subId\t(.*)\n', logs).group(1)

        ## Check for previous consent.
        consent = re.search('consent\t(.*)\n', logs)
        if consent and consent.group(1) == 'True': info['consent'] = True       # consent = true
        elif consent and consent.group(1) == 'False': info['consent'] = False   # consent = false
        elif consent: info['consent'] = consent.group(1)                        # consent = bot

        ## Check for previous experiment.
        experiment = re.search('experiment\t(.*)\n', logs)
        if experiment: info['experiment'] = experiment.group(1)

        ## Check for previous complete.
        complete = re.search('complete\t(.*)\n', logs)
        if complete: info['complete'] = complete.group(1)

        ## Update metadata.
        for k, v in info.items(): session[k] = v

        ## Redirect participant as appropriate.
        if 'complete' in session:
            return redirect(url_for('complete.complete'))
        elif 'experiment' in session:
            return redirect(url_for('experiment.experiment'))
        else:
            return redirect(url_for('consent.consent'))

    ## Case 7: first visit, workerId present.
    else:

        ## Update metadata.
        for k, v in info.items(): session[k] = v
        write_metadata(session, ['workerId','hitId','assignmentId','subId','address','user_agent'], 'w')

        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))
