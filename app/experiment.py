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
        return render_template('experiment.html', workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], a=session['a'], tp_a=session['tp_a'], b=session['b'], tp_b=session['tp_b'], c=session['c'], tp_c=session['tp_c'])
