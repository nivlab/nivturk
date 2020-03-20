from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .io import write_metadata

## Initialize blueprint.
bp = Blueprint('complete', __name__)

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

    ## DEV NOTE:
    ## If you want a custom completion code, replace the return statement with:
    ## > render_template('complete.html', value=session['complete'])

    return render_template('complete.html')
