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

## Specify completion URLs (real and decoy).
url_stem = "https://app.prolific.co/submissions/complete?cc="
complete_url = url_stem + cfg['FLASK']['COMPLETION_CODE']
decoy_url = url_stem + cfg['FLASK']['DECOY_CODE']

@bp.route('/complete')
def complete():
    """Present completion screen to participant."""

    ## Case 1: navigation to completion page without completion flag
    if 'complete' not in session or session['complete'] == False:

        ## Update participant metadata.
        session['ERROR'] = "1012: Visited completion page without valid completion flag."
        write_metadata(session, ['ERROR'], 'a')
        return redirect(decoy_url)

    ## Case 2: data_pass
    else:

        ## Update participant metadata.
        write_metadata(session, ['complete'], 'a')
        return redirect(complete_url)
