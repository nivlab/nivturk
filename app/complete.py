from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""

    ## Access query string.
    query_info = request.args

    ## Confirm all CloudResearch metadata present.
    fields = ['workerId','assignmentId','hitId','a','tp_a','b','tp_b','c','tp_c']
    all_fields = all([f in query_info for f in fields])

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 1: visit complete page without previous completion.
    elif 'complete' not in session:

        ## Flag experiment as complete.
        session['ERROR'] = "1005: Visited complete page before completion."
        session['complete'] = 'reject'
        write_metadata(session, ['ERROR','complete'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

    ## Case 2: visit complete page with previous rejection.
    elif session['complete'] == 'reject':

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

    ## Case 3: visit complete page with previous error.
    elif session['complete'] == 'error':

        ## Determine error code.
        errornum = 1002 if not session['consent'] else 1005

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=errornum))

    ## Case 4: all else.
    else:

        ## Redirect participant with completion code.
        return render_template('complete.html', completion_code=session['code_success'])
