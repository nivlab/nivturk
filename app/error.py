from flask import (Blueprint, redirect, render_template, request, session, url_for)

## Initialize blueprint.
bp = Blueprint('error', __name__)

@bp.route('/error/<int:errornum>')
def error(errornum):
    """Present error message to participant"""
    return render_template('error.html', errornum=errornum)
