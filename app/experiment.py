import sys
from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .utils import gen_code

## Initialize blueprint.
bp = Blueprint('experiment', __name__)

@bp.route('/experiment')
def experiment():
    """Present jsPsych experiment to participant."""

    ## Validate session (prevents duplicate respondents).
    EXTERNAL_CODE = request.args.get('auth')
    INTERNAL_CODE = session['auth']
    VALID = EXTERNAL_CODE == INTERNAL_CODE

    ## Process target code.
    if not VALID:
        return redirect(url_for('error.error', errornum=1008))
    else:
        session['auth'] = gen_code(80)
        return render_template('experiment.html')
