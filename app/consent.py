from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('consent', __name__)

@bp.route('/consent')
def consent():
    """Present consent form to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 1: previously completed experiment.
    elif 'complete' in session:

        ## Update metadata.
        session['WARNING'] = "Revisited consent page."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Case 2: first visit.
    elif not 'consent' in session:

        ## Present consent form.
        return render_template('consent.html')

    ## Case 3: repeat visit, previous bot-detection.
    elif session['consent'] == 'BOT':

        ## Update participant metadata.
        session['WARNING'] = "Revisited consent form."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

    ## Case 4: repeat visit, previous non-consent.
    elif session['consent'] == False:

        ## Update participant metadata.
        session['WARNING'] = "Revisited consent form."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to error (decline consent).
        return redirect(url_for('error.error', errornum=1002))

    ## Case 5: repeat visit, previous consent.
    else:

        ## Update participant metadata.
        session['WARNING'] = "Revisited consent form."
        write_metadata(session, ['WARNING'], 'a')

        ## Redirect participant to alert page.
        return redirect(url_for('alert.alert'))

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
        session['experiment'] = False    # Prevents incognito users
        session['complete'] = 'error'
        write_metadata(session, ['consent','experiment','complete'], 'a')

        ## Redirect participant to error (unusual activity).
        return redirect(url_for('error.error', errornum=1005))

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
        return redirect(url_for('error.error', errornum=1002))
