import os
from flask import (Blueprint, redirect, request, render_template, url_for)
from .utils import gen_code

bp = Blueprint('consent', __name__)

@bp.route('/')
def consent():
    """Present consent form to participant."""
    return render_template('consent.html')

@bp.route('/', methods=['POST'])
def consent_post():
    """Process participant repsonse to consent form."""
    subj_consent = int(request.form['subj_consent'])
    if subj_consent:
        code = gen_code(40)
        return redirect(url_for('experiment.survey', trg=code))
    else:
        ## TODO: Pass appropriate error code
        return redirect(url_for('error.error'))
