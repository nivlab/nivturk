from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata
from .utils import gen_code

## Initialize blueprint.
bp = Blueprint('consent', __name__)

@bp.route('/consent')
def consent():
    """Present consent form to participant."""

    ## Error-catching: screen for previous visits.
    if 'consent' in session:

        ## Update participant metadata.
        session['ERROR'] = "1006: Revisited consent form."
        write_metadata(session, ['ERROR'], 'a')

        ## Redirect participant to error (previous participation).
        return redirect(url_for('error.error', errornum=1006))

    else:

        ## Present consent form.
        return render_template('consent.html')

@bp.route('/consent', methods=['POST'])
def consent_post():
    """Process participant repsonse to consent form."""

    ## Retrieve participant response.
    subj_consent = int(request.form['subj_consent'])

    ## Check participant response.
    if subj_consent:

        ## Update participant metadata.
        session['consent'] = True
        write_metadata(session, ['consent'], 'a')

        ## Redirect participant to experiment.
        return redirect(url_for('experiment.experiment'))

    else:

        ## Update participant metadata.
        session['consent'] = False
        write_metadata(session, ['consent'], 'a')

        ## Redirect participant to error (decline consent).
        return redirect(url_for('error.error', errornum=1002))
