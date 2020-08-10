---
layout: default
title: Getting started
parent: Detailed documentation
nav_order: 1
---

# Getting started

There are two major steps that you will need to take to serve your own custom experiment. The first is to set up the NivTurk server, and the second is to write the code that runs your experiment. The NivTurk software that is documented on this website is designed to help with the first of these two things. We have included some resources below to help get started with the second.

## The NivTurk server

#### What is a server, and how do I set it up?
A server is a bundle of software code that presents ('serves') your experiment website to participants when they arrive at it from a recruitment website like Prolific or Amazon Mechanical Turk. NivTurk is a software package, written using [Flask](https://flask.palletsprojects.com/en/1.1.x/). Its goal is to guide participants through a standard sequences of websites (consent form, alert page, experiment, et cetera) in a robust way.

To get this working, the NivTurk server code needs to be running on a computer that has ports open to the external world. For the most part we run the code on virtual machines set up by PNI IT, but in principle as long as you have IRB approval there is no reason why the NivTurk code could not run on a different virtual machine (e.g., one hosted by AWS) or even a physical machine sitting in an office somewhere.

To set up your server, follow the instructions on the [Serving experiments](../serving/) page.

<br>
#### Overview of NivTurk code
The NivTurk code lives in the `app` folder of the repo. User-defined html pages live in the `app/templates/` subfolder, and your experiment's static files (images, audio, videos, JavaScript libraries, et cetera) live in the `app/static/` subfolder.

With the exception of the `app.ini` file, which you may need to update if you are recruiting on Prolific (see below), you should not need to change any of the code in the `app` folder. Instead, you can set up your experiment by changing the code in `app/templates/experiment.html` and by adding all of the necessary files to `app/static/`.

See the [Code architecture](../architecture/) page for more information on the role played by each of the specific NivTurk files in the `app` folder.

<br>
#### What happens when a participant visits the server?
When a participant visits the server, they will first see a consent form (`app/templates/consent.html`). If they consent to take part in the experiment, they will next see an alert page (`app/templates/alert.html`) explaining some further details of study participation. They will then be guided the page specified by the user-written experiment page (`app/templates/experiment.html`). This is where the experiment code should be situated. If the participant experiences an error during this process (e.g., by refreshing the experiment webpage), they will be directed to an error page instructing them to return the study (`app/templates/error.html`).

Each html page has an associated Flask file (written in Python) that specifies the control flow and internal logic of the webpage. The Flask file for the consent page can be found at `app/consent.py`, that for the alert page at `app/alert.py`, and so on. Except for advanced use cases, users should not need to edit any of these files.

<br>
#### What happens to the data?
In NivTurk, there are two kinds of data:

- _metadata_ are all the unique (and potentially identifying) things about a participant, such as their Prolific/Amazon ID, their IP address, and their history of interactions with our website. _metadata_ are saved and updated any time the participant interacts with any of the study webpages.
- _data_ are all of the anonymised task and survey information that we collect (choices, RTs, etc.). _data_ are saved only as a result of the participant's interactions with the code in `experiment.html`.

To keep the NivTurk as lightweight (and robust) as possible, metadata are not stored in a SQL database or similar. Instead, each participant (uniquely identified by their Prolific or Amazon ID) is associated with a single text file in the `metadata` directory. New lines are appended to this file as the participant moves through the experiment, which allows us to keep a log of each participant's progress. Using JavaScript, it is also possible to write messages into this metadata file directly from the experiment (see [here](/nivturk/docs/cookbook/message-pass)).

Experiment data themselves are saved in one of two places. Data for complete participants are saved in the `data` folder. Data for participants who have been rejected online (an advanced use case; see [here](/nivturk/docs/cookbook/online-rejection)) are saved in the `reject` folder.

Note that metadata and data files are stored separately by design. This maximises the anonymity of the data, and means that potentially identifying information in each participant's metadata file need never leave our secure virtual machines.


## Writing your experiment code

In general, you can use any framework or language that you like to write the experiment code. As long as this code can be loaded within an html page (specifically, the html page called `experiment.html` and located in the `app` folder), NivTurk should be able to recognise it and run it.

### JSPsych

In practice, for our experiments to date, we have used [JSPsych](https://www.jspsych.org/). JSPsych is a framework for presenting psychological experiments within a web browser, developed and maintained by Josh de Leeuw.
