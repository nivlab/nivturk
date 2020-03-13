from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_data, write_metadata
from .utils import gen_code

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""

    ## DEV NOTE:
    ## If you want a custom completion code, replace the return statement with:
    ## > render_template('complete.html', value=session['complete'])

    return render_template('complete.html')

@bp.route('/datadump', methods = ['POST'])
def datadump():
    """Save jsPsych data to disk."""

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsch data to disk.
        write_data(session, JSON)

    ## Update participant metadata.
    session['complete'] = True
    write_metadata(session, ['complete'], 'a')

    ## DEV NOTE:
    ## To pass a custom completion code, include the following line of code:
    ## > session['complete'] = gen_code(16)

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The jsPsych function `return-data` handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)
