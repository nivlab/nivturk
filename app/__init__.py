import os
from flask import (Flask, render_template, request, session)

def create_app():
    """Create and configure an instance of the Flask application."""

    ## Initialize Flask application.
    app = Flask(__name__, instance_relative_config=True)

    ## ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    ## Apply blueprints to application.
    from app import complete, consent, experiment, error
    app.register_blueprint(complete.bp)
    app.register_blueprint(consent.bp)
    app.register_blueprint(experiment.bp)
    app.register_blueprint(error.bp)

    ## Set consent form as starting point.
    app.add_url_rule('/', endpoint='consent')

    return app
