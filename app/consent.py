import os
from flask import (Blueprint, redirect, request, render_template, url_for)

bp = Blueprint('consent', __name__)

@bp.route('/')
def consent():
    """Present consent form to participant."""
    return render_template('consent.html')

@bp.route('/', methods=['POST'])
def consent_post():
    """Process participant repsonse to consent form."""
    subj_consent = request.form['subj_consent']
    if subj_consent:
        return redirect(url_for('experiment.survey'))
    else:
        return 'oh no!'
