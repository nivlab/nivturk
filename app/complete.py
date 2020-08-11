from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
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

        ## Redirect participant with decoy code.
        url = "https://app.prolific.co/submissions/complete?cc=" + session['code_reject']
        return redirect(url)

    ## Case 2: visit complete page with previous rejection.
    elif session['complete'] == 'success':

        ## Update metadata.
        session['WARNING'] = "Revisited complete."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant with completion code.
        url = "https://app.prolific.co/submissions/complete?cc=" + session['code_success']
        return redirect(url)

    ## Case 3: visit complete page with previous rejection.
    elif session['complete'] == 'reject':

        ## Update metadata.
        session['WARNING'] = "Revisited complete."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant with decoy code.
        url = "https://app.prolific.co/submissions/complete?cc=" + session['code_reject']
        return redirect(url)

    ## Case 4: visit complete page with previous error.
    else:

        ## Update metadata.
        session['WARNING'] = "Revisited complete."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))
