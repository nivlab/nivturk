from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .utils import gen_code

## Initialize blueprint.
bp = Blueprint('consent', __name__)

@bp.route('/consent')
def consent():
    """Present consent form to participant."""
    return render_template('consent.html')

@bp.route('/consent', methods=['POST'])
def consent_post():
    """Process participant repsonse to consent form."""

    ## Retrieve participant response.
    subj_consent = int(request.form['subj_consent'])

    ## Check participant response.
    if subj_consent:

        ## Generate authorization code.
        session['auth'] = gen_code(80)

        ## Redirect participant to experiment.
        return redirect(url_for('experiment.experiment', auth=session['auth']))

    else:

        return redirect(url_for('error.error', errornum=1006))
