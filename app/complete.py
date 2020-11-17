from flask import (Blueprint, redirect, render_template, request, session, url_for)

## Initialize blueprint.
bp = Blueprint('complete', __name__)

@bp.route('/complete/')
def complete():
    """Present completion screen to participant."""
    return render_template('complete.html')
