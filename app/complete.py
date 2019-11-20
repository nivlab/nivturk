from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_data, write_metadata
from .utils import gen_code, compute_bonus

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""
    return render_template('complete.html', value=session['complete'])

@bp.route('/datadump', methods = ['POST'])
def datadump():
    """Save jsPsych data to disk."""

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsch data to disk.
        write_data(session, JSON)

    ## Update participant metadata.
    session['bonus'] = compute_bonus()
    write_metadata(session, ['bonus'], 'a')

    ## Generate completion code.
    session['complete'] = gen_code(16)

    return redirect(url_for('complete.complete'))
