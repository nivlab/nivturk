import os, sys, configparser
from flask import (Flask, redirect, render_template, request, session, url_for)
from .io import save_anon_data
from .utils import gen_code

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Define directories.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

## Define application directory.
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Load and parse configuration file.
cfg = configparser.ConfigParser()
cfg.read(os.path.join(ROOT_DIR, 'app.ini'))

## Unpack configuration.
DB_DIR = os.path.join(ROOT_DIR, cfg['IO']['DB'])
DATA_DIR = os.path.join(ROOT_DIR, cfg['IO']['DATA'])
TASK = cfg['IO']['TASK']

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Initialize application.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = cfg['FLASK']['SECRET_KEY']

## Set consent form as starting point.
app.add_url_rule('/', endpoint='consent')

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Consent form.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

@app.route('/')
def consent():
    """Present consent form to participant."""
    return render_template('consent.html')

@app.route('/', methods=['POST'])
def consent_post():
    """Process participant repsonse to consent form."""
    subj_consent = int(request.form['subj_consent'])
    if subj_consent:
        session['auth'] = gen_code(80)
        return redirect(url_for('experiment', auth=session['auth']))
    else:
        return redirect(url_for('error', errornum=1006))

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Experiment.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

@app.route('/experiment')
def experiment():
    """Present experiment to participant."""

    ## Validate session.
    EXTERNAL_CODE = request.args.get('auth')
    INTERNAL_CODE = session['auth']
    VALID = EXTERNAL_CODE == INTERNAL_CODE

    ## Process target code.
    if not VALID:
        return redirect(url_for('error', errornum=1008))
    else:
        session['auth'] = gen_code(80)
        return render_template('experiment.html')

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Task completion.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

@app.route('/complete')
def complete():
    """Present completion screen to participant."""
    return render_template('complete.html', value=session['complete'])

@app.route('/datadump', methods = ['POST'])
def datadump():

    ## Parse and save jsPsych data.
    if request.is_json:

        JSON = request.get_json()
        save_anon_data(JSON, TASK, DATA_DIR)

    session['complete'] = gen_code(16)

    return redirect(url_for('complete'))

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Error page.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

@app.route('/error/<int:errornum>')
def error(errornum):
    """Present error message to participant"""
    return render_template('error.html', errornum=errornum)
