from flask import (Blueprint, redirect, render_template, request, session, url_for)

## Initialize blueprint.
bp = Blueprint('input', __name__)

@bp.route('/input/')
def input():
    """Present completion screen to participant."""
    return render_template('input.html')

@bp.route('/input/', methods=['POST'])
def input_post():
    """Process participant response to input page."""

    ## Retrieve participant response.
    id_input = request.form['id-input']  # get the user's id from the form

    ## Case 1: workerId present.
    if id_input:

        ## If present, participant is implicitly redirected back to index (home).
        return redirect(url_for('index', workerId=id_input))

    ## Case 2: missing workerId.
    else:

        ## If absent, participant is re-presented the input page.
        return render_template('input.html')
