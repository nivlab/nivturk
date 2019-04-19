import os
from flask import (Blueprint, render_template)

bp = Blueprint('experiment', __name__)

@bp.route('/experiment')
def survey():
    """Present survey to participant."""
    return render_template('survey.html')
