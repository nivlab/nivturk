import os, sys
from flask import (Flask, redirect, render_template, request, session, url_for)
from pandas import read_json
from .utils import gen_code

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Main application.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

## Initialize Flask application.
app = Flask(__name__, instance_relative_config=True)
app.secret_key = os.urandom(24).hex()

## ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

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
        session['auth'] = gen_code(40)
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
        session['auth'] = gen_code(40)
        return render_template('experiment.html')

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Task completion.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

@app.route('/complete')
def complete():
    """Present completion screen to participant."""
    code = gen_code(16)
    return render_template('complete.html', value=code)

@app.route('/datadump', methods = ['POST'])
def datadump():

    ## Parse and save jsPsych data.
    if request.is_json:

        ## TODO: setup data writing program

        data = request.get_json()
        data = read_json(data)
        data.to_csv('test.csv', index=False)

    return redirect(url_for('complete'))

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Error page.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

@app.route('/error/<int:errornum>')
def error(errornum):
    """Present error message to participant"""
    return render_template('error.html', errornum=errornum)
