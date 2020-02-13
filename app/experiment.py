from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('experiment', __name__)

@bp.route('/experiment')
def experiment():
    """Present jsPsych experiment to participant."""

    '''
    ## Error-catching: screen for previous visits.
    if 'experiment' in session:

        ## Update participant metadata.
        session['ERROR'] = "1004: Revisited experiment."
        write_metadata(session, ['ERROR'], 'a')

        ## Redirect participant to error (previous participation).
        return redirect(url_for('error.error', errornum=1004))
        '''

        #else:

    ## Update participant metadata.
    session['experiment'] = True
    write_metadata(session, ['experiment'], 'a')

    ## Present experiment.
    return render_template('experiment.html', workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], a=session['a'], tp_a=session['tp_a'], b=session['b'], tp_b=session['tp_b'], c=session['c'], tp_c=session['tp_c'])
