---
layout: default
title: Using TurkPrime
nav_order: 6
parent: Detailed documentation
has_children: false
---

# Using TurkPrime (CloudResearch)

This page provides information on getting an experiment set up on TurkPrime using NivTurk.

This assumes that you already have working experiment code in your `experiment.html` file, and that you have tested it locally (as well as testing its data-saving on a server).

## Initialising the TurkPrime study
From the Dashboard, under 'Create a Study', click 'Mturk Toolkit'. This will create a new study. You should follow the steps there to fill in information about your study. 

Below are the sections that have contents related to NivTurk.

### Setup HIT and Payment
- Set 'Survey Hyperlink' to `http://<ip-address>:<port-number>/`, as discussed on the [Serving experiments page](../serving). Make sure you include the forward slash `/` at the end, and make sure that you do not include the angle brackets.
- NivTurk expects several arguments to be provided from TurkPrime in the study URL (`workerId`, `assignmentId` and `hitId`). Make sure to keep the box for 'Do not add query string parameters' unselected (as default).

### How Workers are Approved
- NivTurk uses Dynamic Completion Code. Thus, select the option 'Each worker will have a unique secret code. Your HIT can either be auto-approved or manually approved.'
- With the Dynamic Completion Code, TurkPrime by default automatically approve workers. If you prefer to manually examine the codes, you can select 'Manual Assignment Management'. Otherwise, keep it unselected, and fill in the time to auto pay workers.

## Useful information about TurkPrime studies

### MicroBatch and HyperBatch

MTurk charges fees for HITs: 20% if less than or equal to 9 participants per HIT, 40% if more than 9 participants. To avoid the over charge, TurkPrime offers the option of using MicroBatches: it batches the study into small HITs of 9 workers; when one HIT finishes, the next one will be launched automatically. Using MicroBatches, however, will lead to inevitable delay of launching the experiment. A better option is to use HyperBatch. This is a Pro Feature of TurkPrime, and is recommended.

### Preview the experiment before launching

Once you finish setting up the study, you will see it on Dashboard. You can click on the study, and then click 'CloudResearch Survey Preview'. This way, you can preview the experiment as participants see it.
