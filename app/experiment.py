from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_data, write_metadata

## Initialize blueprint.
bp = Blueprint('experiment', __name__)

@bp.route('/experiment')
def experiment():
    """Present jsPsych experiment to participant."""

    ## Error-catching: screen for previous visits.
    if 'experiment' in session:

        ## Update participant metadata.
        session['ERROR'] = "1004: Revisited experiment."
        write_metadata(session, ['ERROR'], 'a')

        ## Redirect participant to error (previous participation).
        return redirect(url_for('error.error', errornum=1004))

    else:

        ## Update participant metadata.
        session['experiment'] = True
        write_metadata(session, ['experiment'], 'a')

        ## Present experiment.
        return render_template('experiment.html', workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], a=session['a'], tp_a=session['tp_a'], b=session['b'], tp_b=session['tp_b'], c=session['c'], tp_c=session['tp_c'])

@bp.route('/experiment', methods=['POST'])
def experiment_post():
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

@bp.route('/data_pass', methods = ['POST'])
def data_pass():
    """Save complete jsPsych dataset to disk."""

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsch data to disk.
        write_data(session, JSON, method='pass')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The jsPsych function `return-data` handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)

@bp.route('/data_reject', methods = ['POST'])
def data_reject():
    """Save rejected jsPsych dataset to disk."""

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsch data to disk.
        write_data(session, JSON, method='reject')

    ## Update participant metadata.
    session['complete'] = True
    session['ERROR'] = "1011: Noncompliant behavior."
    write_metadata(session, ['complete','ERROR'], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The jsPsych function `return-data` handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)
