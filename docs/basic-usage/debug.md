---
layout: default
title: Debug mode
parent: Basic Usage
nav_order: 8
---

# Debug mode

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
