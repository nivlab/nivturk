from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
    print
    """Present completion screen to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 1: visit complete page without previous completion.
    elif 'complete' not in session:

        ## Flag experiment as complete.
        session['ERROR'] = "1005: Visited complete page before completion."
        session['complete'] = 'reject'
        write_metadata(session, ['ERROR','complete','code_reject'], 'a')

        ## Redirect participant with err code - NOT COMPLETE.
        return redirect(url_for('error.error', errornum=1005))

    ## Case 2: visit complete page with previous rejection.
    elif session['complete'] == 'reject':

        session['ERROR'] = "1006: visit complete page with previous rejection"
        ## Redirect participant with err code - PREV REJECT.
        return redirect(url_for('error.error', errornum=1006))

    ## Case 3: visit complete page with previous success.
    elif session['complete'] == 'success':

        ## Redirect participant to complete
        return render_template('complete.html')
