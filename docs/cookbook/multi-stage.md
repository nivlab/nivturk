---
layout: default
title: Multiple stages
parent: Cookbook
nav_order: 7
---

# Multiple Stages

By default, all jsPsych activities are constrained to one page, `/app/experiment.html`. Though this should be fine for most experiments, this may be less than ideal for experiments with multiple stages or tasks.

For example, imagine an experiment involving two tasks: a Stroop task and a gambling task. If these two tasks are combined into one jsPsych timeline and served via `/app/experiment.html` as usual, then an experimenter might run into a few problems. First, the data will only be saved at the end of the time -- that is, the data for the Stroop task will only be saved when the gambling task ends. It might preferable for the data to be saved at the end of each respective task. Second, any restart or refresh events will start over the *entire* experiment -- even if the participant already completed the first task. It would instead be preferable for the timeline to start at the first unfinished experiment.

It is very doable to extend NivTurk to have multiple experiment pages (e.g. one per task). To do so, however, requires reconfiguring the routes by which participants are moved across pages and thus requires working with Flask itself. The changes required are numerous but relatively straightforward.

A complete working example can be found here.
