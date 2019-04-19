from flask import (Blueprint, redirect, request, render_template, url_for)
from pandas import read_json
from .utils import gen_code

bp = Blueprint('complete', __name__)

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""
    code = gen_code(16)
    return render_template('complete.html', value=code)

@bp.route('/datadump', methods = ['POST'])
def datadump():

    ## Parse and save jsPsych data.
    if request.is_json:

        ## TODO: setup data writing program

        data = request.get_json()
        data = read_json(data)
        data.to_csv('test.csv', index=False)

    return redirect(url_for('complete.complete'))
