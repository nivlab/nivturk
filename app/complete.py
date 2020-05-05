import os, configparser
from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('complete', __name__)

## Define root directory.
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Load and parse configuration file.
cfg = configparser.ConfigParser()
cfg.read(os.path.join(ROOT_DIR, 'app.ini'))

## Specify completion URL.
complete_url = "https://app.prolific.co/submissions/complete?cc=" + cfg['FLASK']['COMPLETION_CODE']

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""

    ## Error-catching: screen for previous visits.
    if 'complete' in session:

        ## Update participant metadata.
        session['WARNING'] = "Revisited complete page."
        write_metadata(session, ['WARNING'], 'a')

    else:

        ## Update participant metadata.
        session['complete'] = True
        write_metadata(session, ['complete'], 'a')
        return redirect(complete_url)
