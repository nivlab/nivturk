---
layout: default
title: Developing experiments
parent: Basic Usage
nav_order: 2
---

# Developing experiments
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

This page describes how to integrate an existing jsPsych experiment with NivTurk. It does not go into how to develop the jsPsych experiment itself. For tutorials and examples of jsPsych experiments, you can check out the [jsPsych](https://www.jspsych.org/latest/tutorials/hello-world/) and [jsPsych-demos](https://nivlab.github.io/jspsych-demos/) pages.

If you are new to JavaScript, you can find plenty of resources for getting started on the web. Two examples are [DigitalOcean](https://www.digitalocean.com/community/tutorial_series/how-to-code-in-javascript){:target="_blank"} and [W3Schools](https://www.w3schools.com/js/){:target="_blank"}.

## Integrating your experiment

Integrating an existing jsPsych experiment into NivTurk is relatively straightforward. There are only a few steps to follow.

### Download NivTurk

First you will need to clone or download NivTurk. For details, please see the download & install [page](../installation).

### Copy your files

Next you need to copy your files into the NivTurk `app` folder. In general, we recommend sorting your files according to the predefined folder directories (e.g. place JavaScript files in `/app/static/js`), but this is not required.

Note that by default NivTurk ships with jsPsych v6.3.1. You may upgrade or downgrade the default copy of jsPsych as needed (though of course we recommend using later versions).

### Copy your timeline

Then copy your jsPsych timeline into the main experiment file (`/app/templates/experiment.html`). Make sure to import all requisite files in the `<HEAD>` block of the file.

Alternately, if you have a preexisting experiment HTML file, you may overwrite the default `experiment.html` file with it (e.g. rename your file as `experiment.html` and copy it into the `/app/templates/` directory).

If you choose the second approach, you will need to make sure of two things. First, you need to make sure to import the NivTurk plugins (`/app/static/js/nivturk-plugins.js`).

Second, you will need to include the following code in the `on_finish` section of your `jsPsych.init` call. For Prolific users, the code to include is below. (For a complete example, see [here](https://github.com/nivlab/nivturk/blob/prolific/app/templates/experiment.html)):

```html
{%raw%}if (low_quality) {

  // Save rejected dataset to disk.
  redirect_reject("{{workerId}}", "{{assignmentId}}", "{{hitId}}", "{{code_reject}}");

} else {

  // Save complete dataset to disk.
  redirect_success("{{workerId}}", "{{assignmentId}}", "{{hitId}}", "{{code_success}}");

}{%endraw%}
```

For MTurk users, the code to include is below. (For a complete example, see [here](https://github.com/nivlab/nivturk/blob/mturk/app/templates/experiment.html)):

```html
{%raw%}if (low_quality) {

  // Save rejected dataset to disk.
  redirect_reject("1005");

} else {

  // Save complete dataset to disk.
  redirect_success("{{workerId}}", "{{assignmentId}}", "{{hitId}}",  "{{a}}", "{{tp_a}}", "{{b}}", "{{tp_b}}", "{{c}}", "{{tp_c}}");

}{%endraw%}
```

The functions `redirect_success` and `redirect_reject` are NivTurk functions (defined in `/app/static/js/nivturk-plugins.js`) that allow for jsPsych to communicate with NivTurk at the end of an experiment. Specifically, these functions are responsible for both data saving and participant redirects at the end of an experiment.

Note that we include different metadata depending on whether we are using Prolific or MTurk. This is because of the different completion dynamics of the two recruitment pages; see the [Using Prolific](../prolific) and [Using MTurk](../mturk) pages for more information.

## Testing your experiment

To test out the application (but **not** to serve an actual experiment, see next section) we can use Flask's default web server. **From the nivturk folder**, run the following commands on the VM:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_RUN_PORT=9000
flask run --host=0.0.0.0
```

The first two lines tell Flask what application and in what mode to run. The third line specifies the port number. Our VMs are configured to run on ports 9000-9010. The final line starts the web server, and the `host` argument specifies to use an [externally visible server](https://flask.palletsprojects.com/en/1.1.x/quickstart/).

The example code above puts the experiment on port 9000. If you are unsure which ports are currently free for you to use, you can refer to [the relevant section](../../troubleshooting#determining-if-a-port-is-in-use) of the Troubleshooting page.

### Debug mode

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

## Niv / Daw Labs

### Consent forms

The most up-to-date IRB consent forms for online behavioral experiments run in the Niv and Daw lab are already available as HTML documents:

- [Niv lab](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/niv.html) (default consent form in NivTurk)
- [Daw lab](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/daw.html)

#### Niv lab researchers
{: .no_toc }

Please note that before running an experiment, you may need to make several changes to the consent form:

- You will need to update the text at [line 42](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/niv.html#L42) to reflect the duration of your experiment (note: the red font is only there to remind you to change this portion of the consent form).
- You may need to comment out [lines 57-69](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/niv.html#L57) if you are not using psychiatric symptom questionnaires.

#### Daw lab researchers
{: .no_toc }

Please note that before running an experiment, you may need to make several changes to the consent form:

- You will need to update the text at [line 53](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/daw.html#L53) and [line 77](https://github.com/nivlab/jspsych-demos/blob/main/tasks/consent/daw.html#L77) to reflect the duration of your experiment.
- Please consult the latest version of the online behavioral experiments IRB for guidelines on paying participants.
