from flask import (Blueprint, redirect, render_template, request, session, url_for)

## Initialize blueprint.
bp = Blueprint('input', __name__)

@bp.route('/input/')
def input():
    """Present completion screen to participant."""
    return render_template('input.html')

@bp.route('/input/', methods=['POST'])
def input_post():
    """Process participant repsonse to alert page."""

    id_input = request.form['id-input']  # get the user's id from the form

    if id_input: # check to see if input is present
        return redirect(url_for('index', workerId=id_input))
    else:
        return render_template('input.html')
