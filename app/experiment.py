import sys
from flask import (Blueprint, render_template, redirect, request, url_for)

bp = Blueprint('experiment', __name__)

@bp.route('/experiment')
def survey():
    """Present survey to participant."""

    ## Process target code.
    code = request.args.get('trg')
    if code is None:
        return redirect(url_for('error.error'))
    # elif 

    return render_template('survey.html')
