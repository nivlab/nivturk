import os
from flask import (Flask, render_template, request)

def create_app():
    """Create and configure an instance of the Flask application."""

    ## Initialize Flask application.
    app = Flask(__name__, instance_relative_config=True)

    ## ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    ## apply the blueprints to the app
    from app import consent, experiment, complete
    app.register_blueprint(consent.bp)
    app.register_blueprint(experiment.bp)
    app.register_blueprint(complete.bp)

    ## Redirect to consent form.
    app.add_url_rule('/', endpoint='consent')

    return app
