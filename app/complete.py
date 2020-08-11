from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""

    ## Access query string.
    query_info = request.args

    ## Confirm all TurkPrime metadata present.
    fields = ['workerId','assignmentId','hitId','a','tp_a','b','tp_b','c','tp_c']
    all_fields = all([f in query_info for f in fields])

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 1: visit complete page with previous rejection.
    elif session.get('complete') == 'reject':

        ## Update metadata.
        session['WARNING'] = "Revisited complete."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

    ## Case 2: visit complete page with previous error.
    elif session.get('complete') == 'error':

        ## Update metadata.
        session['WARNING'] = "Revisited complete."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

    ## Case 3: visit complete page but missing metadata.
    elif session.get('complete') == 'success' and not all_fields:

        ## Update metadata.
        session['WARNING'] = "Revisited complete."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant with complete metadata.
        url = "/complete?workerId=%s&assignmentId=%s&hitId=%s&a=%s&tp_a=%s&b=%s&tp_b=%s&c=%s&tp_c=%s" %(session['workerId'], session['assignmentId'], session['hitId'], session['a'], session['tp_a'], session['b'], session['tp_b'], session['c'], session['tp_c'])
        return redirect(url)

    ## Case 4: all else.
    else:

        ## Redirect participant with completion code.
        return render_template('complete.html')
