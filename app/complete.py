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
        return redirect("http://www.google.com")
