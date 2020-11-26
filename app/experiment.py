from flask import (Blueprint, redirect, render_template, request, session, url_for)
from datetime import datetime
from .io import write_data, write_metadata

## Initialize blueprint.
bp = Blueprint('experiment', __name__)

@bp.route('/experiment')
def experiment():
    """Present jsPsych experiment to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('input.input'))

    ## Case 1: previously completed experiment.
    elif 'complete' in session:

        ## Update metadata.
        session['WARNING'] = "Revisited experiment page after completion."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Case 2: legitimate visit.
    else:

        ## Define a timestamp for experiment start
        session['expt_start_time'] = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

        ## Update participant metadata.
        session['experiment'] = True
        write_metadata(session, ['experiment'], 'a')

        ## Present experiment.
        return render_template('experiment.html', workerId=session['workerId'])

@bp.route('/experiment', methods=['POST'])
def pass_message():
    """Write jsPsych message to metadata."""

    if request.is_json:

        ## Retrieve jsPsych data.
        msg = request.get_json()

        ## Update participant metadata.
        session['MESSAGE'] = msg
        write_metadata(session, ['MESSAGE'], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)

@bp.route('/save_data', methods = ['POST'])
def save_data():
    """Save complete jsPsych dataset to disk."""

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Retrieve status.
        status = request.args.get('status')

        ## Save jsPsch data to disk.
        write_data(session, JSON)

    ## Flag experiment as complete.
    if status == "complete":
        session['complete'] = 'success'
        write_metadata(session, ['complete'], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The corresponding jsPsych function handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)
