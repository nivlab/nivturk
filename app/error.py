from flask import (Blueprint, render_template)

bp = Blueprint('error', __name__)

@bp.route('/error')
def error():
    """Present error message to participant"""
    return render_template('error.html')
