---
layout: default
title: Getting started
nav_order: 2
has_children: false
permalink: /docs/getting-started
---

# Getting started

This page gives of an overview of NivTurk --- what it's for, why it's helpful, and what you need in order to use it. It is written with new or potential users in mind.

- To download & install NivTurk, see the [Installation](/nivturk/docs/basic-usage/installation) page.
- To serve an experiment, see the [Serving](/nivturk/docs/basic-usage/serving) page.

## A brief introduction to NivTurk

### What is it?

NivTurk is a lightweight application for running online behavioral experiments. It is not the experiment itself; instead NivTurk is the software responsible for serving experiments to participants via the web, saving their responses, and maintaining a record of participation.   

### Why should I use it?

NivTurk makes online data collection easy (well, _easier_) and has several noteworthy features:

- **Plug-and-play:** NivTurk should work with any JavaScript-based experiment library (e.g. [jsPsych](jspsych.org)).
- **Platform flexibility:** NivTurk is compatible with Prolific, MTurk/Cloudresearch, or any other standalone participant recruitment platform (e.g. undergraduate student pools).
- **Minimal requirements:** NivTurk has few dependencies, requiring only a web server and a python environment (see next section for details).
- **Database-less:** NivTurk does not require the configuration of any database (e.g. MySQL).
- **Easily customizable:** in total, NivTurk is only a few hundred lines of python code (50% of which is comments), making it easy to extend or adapt.

### What are its requirements?

NivTurk has three major requirements: (1) an experiment made using a web-compatible software or language; (2) a web server, and (3) a python environment. We describe each in turn below.

#### (1) Web-compatible experiments

In principle, NivTurk is compatible with any web-based framework or language that can be used to make an experiment. As long as your experiment can be executed in an HTML page, NivTurk should be able to recognize it and run it. We recommend using [jsPsych](https://www.jspsych.org){:target="_blank"} to make your experiment. jsPsych is a powerful and flexible framework for making web-based behavioral experiments.

Alternatively, you can make your experiment using JavaScript and a host of other libraries (e.g. React). If you are new to JavaScript, you can find plenty of resources for getting started on the web. Two examples are [DigitalOcean](https://www.digitalocean.com/community/tutorial_series/how-to-code-in-javascript){:target="_blank"} and [W3Schools](https://www.w3schools.com/js/){:target="_blank"}.

#### (2) A web server

Through NivTurk, your experiment will become a temporary webpage that participants will visit in order to complete your study. As such, you need a web server on which to host your experiment.

If you are in a university setting, your IT department might set up a web server for you (e.g. the Niv/Daw labs use a handful of servers set up by Princeton). Alternately NivTurk is compatible with commercial web-hosting services, like Amazon Web Services (AWS). If you're savvy enough, you could even set up your own dedicated server machine.

#### (3) A python environment

In order to run NivTurk, [python](https://www.python.org) must be installed on the web server. NivTurk is written on top of [Flask](https://flask.palletsprojects.com/){:target="_blank"}, a python package used for making web applications. Flask is useful for, for example, apps that guide participants through a standard sequence of webpages (e.g. consent form, experiment, payment, etc.) in a robust way.

### Who should use NivTurk?

In general, NivTurk is intended for researchers looking to run behavioral experiments online who are:

- Planning to, or have already made, an experiment using web-based software
- Familiar or comfortable with python programming and using the command line
- Looking to have fine-grained control over how their experiments are run

### Who _shouldn't_ use NivTurk?

Of course, we think NivTurk is for everyone. That said, NivTurk may not be an ideal solution for researchers who are:

- Expecting a fully-automated, polished data collection service (maybe try [Gorilla](https://www.gorilla.sc){:target="_blank"}?)
- Uncomfortable with, or uninterested in learning, python programming or the command line
- Uninterested in the inevitable debugging that comes with free-to-use, homebrewed software ;)
