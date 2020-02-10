from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('consent', __name__)

@bp.route('/consent')
def consent():
    """Present consent form to participant."""

    ## Case 1: first visit.
    if not 'consent' in session:

        ## Present consent form.
        return render_template('consent.html')

    ## Case 2: repeat visit, previous consent.
    elif session['consent']:

        ## Update participant metadata.
        session['WARNING'] = "Revisited consent form."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to alert page.
        return redirect(url_for('alert.alert'))

    ## Case 3: repeat visit, previous non-consent.
    else:

        ## Update participant metadata.
        session['WARNING'] = "Revisited consent form."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (decline consent).
        return redirect(url_for('error.error', errornum=1003))


@bp.route('/consent', methods=['POST'])
def consent_post():
    """Process participant repsonse to consent form."""

    ## Retrieve participant response.
    subj_consent = int(request.form['subj_consent'])
    bot_check = request.form.get('future_contact', False)

    ## Check for suspicious responding.
    if bot_check:

        ## Update participant metadata.
        session['consent'] = 'BOT'
        write_metadata(session, ['consent'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1002))

    ## Check participant response.
    elif subj_consent:

        ## Update participant metadata.
        session['consent'] = True
        write_metadata(session, ['consent'], 'a')

        ## Redirect participant to alert page.
        return redirect(url_for('alert.alert'))

    else:

        ## Update participant metadata.
        session['consent'] = False
        write_metadata(session, ['consent'], 'a')

        ## Redirect participant to error (decline consent).
        return redirect(url_for('error.error', errornum=1003))
