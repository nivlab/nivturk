---
layout: default
title: Using Prolific
nav_order: 4
parent: Basic Usage
has_children: false
---

# Using Prolific
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

This page is a step-by-step guide to setting up an experiment on Prolific using NivTurk. It assumes that you already have working experiment code that has been tested both locally and on the server.

## Start a new study
From the Prolific dashboard, either click 'New study', or duplicate a previous study from within the 'Completed' tab on the sidebar (click 'Action', then 'Duplicate').

## Configure the study

### Study details
- Add a brief description of your study, including an estimated completion time and payment (including bonuses).
- If desired, you can provide an internal name for the study. This can be useful if you want to refer to it in future studies (e.g. excluding those who complete this study from accessing a later study).
- Uncheck the 'mobile' and 'tablet' options. NivTurk is compatible only with desktop computers.

### Study link details
- Set the URL for your experiment to the IP address of the server using the format `http://<ip-address>:<port-number>/`. (To find the IP address of the server, see [here](../serving#accessing-the-experiment).) Make sure you include the forward slash, `/`, at the end, and make sure that you do not include the angle brackets.
- Under 'How to record Prolific IDs', select the option 'I'll use URL parameters'.
- Make sure Prolific will pass the following variables: `PROLIFIC_PID`, `STUDY_ID`, and `SESSION_ID`.
- At the end of the three steps above, the URL in the box under 'What is the URL of your study?' should look something like: <br>{%raw%}`http://128.100.100.100:9000/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}`{%endraw%}

### Study completion
- Under 'How to confirm participants have completed your study', select 'I'll redirect them using a URL'.
- Prolific will then provide a completion code (if you have duplicated the study, this code will be the same as in the study you duplicated from). The completion code is the 8-digit alphanumeric code in the link: `https://app.prolific.co/submissions/complete?cc=<code>`.
- Copy this code and paste it into `app.ini` in the NivTurk folder (for details, see [here](../serving#set-completion-codes-prolific-only)).

### Audience
- Under 'How many participants are you looking to recruit?', set the number of participants you want to recruit.
- Under 'Where should your participants be located?', select the countries from which you would like to recruit participants.
  - Niv lab: we are permitted to recruit from the USA, Canada, Australia, and New Zealand.
  - Daw lab: we are permitted to recruit from the USA only.
- Under 'Select participants', apply any inclusion/exclusion criteria as desired.
  - If you want to exclude participants who participated in previous studies, you can do so via Participation on Prolific > Previous Studies.
  - If you want to include participants based on their Prolific IDs, you can do so via Custom Screener > Custom Allowlist. This is helpful for recruiting back participants who took part in previous studies.

## Launching study
Once you have specified the completion time and payment amount, you can launch your experiment. If you need extra funds, you will be prompted to add them here.

The 'Preview' option gives you the chance to see the study advertisement as participants see it. We <b>strongly recommend</b> experimenters test at least a partial version of their experiment, starting from the Preview screen, to ensure that participants are successfully redirected back to Prolific at the end of an experiment with the correct completion code.
