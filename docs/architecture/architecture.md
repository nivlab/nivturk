---
layout: default
title: Code architecture
parent: Code Architecture
nav_order: 2
---

# Code Architecture

In this section we review the Flask code, which is the scaffolding for our web-based experiments. Specifically, we will detail how the code is organized, what each script does, and how they fit together to create the experimental workflow.

This section will not explain how Flask itself works in great detail. For good explanations of Flask, please see its [Flask documentation](https://flask.palletsprojects.com/en/1.1.x/){:target="_blank"} , its [quickstart guide](https://flask.palletsprojects.com/en/1.1.x/quickstart/#quickstart){:target="_blank"} , and the [Flask mega-tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xvii-deployment-on-linux){:target="_blank"} .

## Code Organization

The following is a high-level overview of the application architecture:

    ├── app                     <- folder containing the Flask application.
    │   ├── static              <- contains static content (e.g. jspsych package)
    │   ├── templates           <- contains html templates
    │
    │   ├── __init__.py         <- main Flask script which runs application
    │   ├── app.ini             <- configuration file
    │   ├── complete.py         <- code for serving experiment completion screen
    │   ├── consent.py          <- code for serving consent form
    │   ├── error.py            <- code for serving error screens
    │   ├── experiment.py       <- code for serving jsPsych experiments
    │   ├── io.py               <- functions for reading/writing data & metadata
    │   ├── utils.py            <- miscellaneous functions
    │
    ├── data                    <- contains saved behavioral data
    │
    ├── metadata                <- contains worker metadata
    │
    ├── requirements.txt        <- required python packages

Complete experimental data is stored in the **data** folder, and worker metadata is stored in the **metadata** folder. The actual application is stored in the **app** folder. As you can see, the application is comprised of a series of modular python scripts, each with a very particular function. We describe each in the order in which participants will encounter them.

### ___init__.py_

This script forms the core of the application. It initializes the Flask application, defines the workflow of experiment pages (consent --> experiment --> completion), and assigns a **Flask Session** to each worker. The **Session** variable -- which contains all the key metadata for a participant -- is passed from page to page as a worker progresses through each stage of the experiment.

When a worker first accesses the application (i.e. arrives at the landing page), this script performs several crucial steps. First, it retrieves the workerId, assignmentId, & hitId from the redirect URL. Next, it checks to see if a file already exists for that participant in the **metadata** folder. (This is accomplished by cross-referencing their workerId.) If the participant has not previously accessed the experiment, a new metadata file is written and they are redirected to the experiment. If not, they are sent to an error page and asked to return the HIT.

### _app.ini_

This file is read in on application start-up and contains three key pieces of information: (1) the path to the data folder, (2) the path to the metadata folder, and (3) the application secret key. The first two do not need to be modified, but **the secret key should be changed when starting a new experiment.** These pieces of information are then used throughout the Flask session.

### _consent.py_

This script presents the consent form to the participant and collects their response. If the participant agrees to the experiment, they are redirected to the experiment. Otherwise they are shown an error message and asked to return the HIT.

Note that participants that do not consent will be prevented from participating in the experiment at a later time, as their workerId will now be present in the metadata folder and thus excluded on revisitation.

### _experiment.py_

This script presents the jsPsych experiment to the participant. Specifically, it will present _experimental.html_ file, which resides in the **templates** folder.

### _complete.py_

This script performs two key functions. First, it presents the completion screen to the participant (upon successfully completing the jsPsych experiment). Second, it retrieves and saves the behavioral data returned by jsPsych. For this to work, a jsPsych experiments needs to specify the **return-data** function (see _/static/js/jspsych-return-data.js_) for **on_finish**. This allows Flask to retrieve a JSON dump of the behavioral data from jsPsych.  The data is then written to the **data** folder.

This section is also where a user might include some code to calculate a bonus for the worker based on their performance. If desired, the script will also append the worker's bonus to their corresponding metadata file.

### _error.py_

This script presents an error message to a participant if one of the following conditions are met:

* A participant reaches the experiment without their workerId in the URL.
* A participant's workerId is already in the metadata folder.
* A participant interferes with the experimental workflow (e.g. clicks the back/forward buttons).

### _io.py_

This script contains functions for reading/writing data and metadata files. See functions for details.

### _utils.py_

This script contains miscellaneous functions. This script is a good place for users to write and store experiment-specific functions (e.g. computing bonus).
