from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('alert', __name__)

@bp.route('/alert')
def alert():
    """Present alert to participant."""

    ## Case 1: first visit.
    if not 'alert' in session:

        ## Update participant metadata.
        session['alert'] = True
        write_metadata(session, ['alert'], 'a')

        ## Present alert page.
        return render_template('alert.html')

    ## Case 2: repeat visit.
    else:

        ## Update participant metadata.
        session['WARNING'] = "Revisited alert page."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (previous participation).
        return redirect(url_for('experiment.experiment'))

@bp.route('/alert', methods=['POST'])
def alert_post():
    """Process participant repsonse to alert page."""

    ## Redirect participant to experiment.
    return redirect(url_for('experiment.experiment'))
