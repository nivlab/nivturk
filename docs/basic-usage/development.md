---
layout: default
title: Developing experiments
parent: Basic Usage
nav_order: 2
---

## Serving via [Flask](https://flask.palletsprojects.com/en/1.1.x/){:target="_blank"} (Development)

To test out the application (but **not** to serve an actual experiment, see next section) we can use Flask's default web server. **From the nivturk folder**, run the following commands on the VM:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_RUN_PORT=9000
flask run --host=0.0.0.0
```

The first two lines tell Flask what application and in what mode to run. The third line specifies the port number. Our VMs are configured to run on ports 9000-9010. The final line starts the web server, and the `host` argument specifies to use an [externally visible server](https://flask.palletsprojects.com/en/1.1.x/quickstart/).

The example code above puts the experiment on port 9000. If you are unsure which ports are currently free for you to use, you can refer to [the relevant section](../../troubleshooting#determining-if-a-port-is-in-use) of the Troubleshooting page.

## Debug mode

The NivTurk software is designed such that participants cannot re-access pages by pressing back or refresh while they are completing the task. Although this is desirable for online recruitment sites (since we want to ensure that participants do not re-start tasks to improve their performance), this may cause headaches during the development of new tasks.

To deal with this, NivTurk has a built-in debugging mode that will temporarily turn off the controls that prevent participants from re-accessing pages. The debug mode is turned on by default, but should usually be turned off before going live with experiments.

### How to set the debug mode

The debug mode is set by the following code at line 9 of the `app.ini` file:

```
# Toggle debug mode (allow repeat visits from same session)
# Accepts true or false
DEBUG = true
```

To turn the debug mode off, change this to `DEBUG = false`.

### How it works

Usually, information about repeat visits to a website is stored in the server-side cookies for a given participant (aka the `session` variable in Flask). When a participant re-access the experiment, we can see from this variable what pages they have previously visited. This is how the exclusion logic works in several places in the software. For instance, see the section of `experiment.py` excerpted below, which checks to see whether the participant has previously visited the experiment page, and prevents them from continuing if this is the case:

```
## Case 2: repeat visit.
elif 'experiment' in session:

    ## Update participant metadata.
    session['ERROR'] = "1004: Revisited experiment."
    session['complete'] = 'error'
    write_metadata(session, ['ERROR','complete'], 'a')

    ## Redirect participant to error (previous participation).
    return redirect(url_for('error.error', errornum=1004))
```

If debug mode is turned on, the `session` variable is cleared every time the participant accesses the experiment. The exact code, in `__init__.py`, is as follows:

```
## Check Flask mode; if debug mode, clear session variable.
debug = cfg['FLASK'].getboolean('DEBUG')
...
## Debug mode: clear session.
if debug:
    session.clear()
```

This prevents refresh errors from being triggered subsequently.

## Consent forms

The most up-to-date IRB consent forms for online behavioral experiments run in the Niv and Daw lab are already available as HTML documents:

- [Niv lab](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/niv.html) (default consent form in NivTurk)
- [Daw lab](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/daw.html)

### Niv lab researchers
{: .no_toc }

Please note that before running an experiment, you may need to make several changes to the consent form:

- You will need to update the text at [line 42](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/niv.html#L42) to reflect the duration of your experiment (note: the red font is only there to remind you to change this portion of the consent form).
- You may need to comment out [lines 57-69](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/niv.html#L57) if you are not using psychiatric symptom questionnaires.

### Daw lab researchers
{: .no_toc }

Please note that before running an experiment, you may need to make several changes to the consent form:

- You will need to update the text at [line 53](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/daw.html#L53) and [line 77](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/daw.html#L77) to reflect the duration of your experiment.
- Please consult the latest version of the online behavioral experiments IRB for guidelines on paying participants.
