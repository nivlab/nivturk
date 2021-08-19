---
layout: default
title: Online rejections
parent: Cookbook
nav_order: 4
---

# Online rejections

In the event of a low quality participant (i.e. careless or inattentive responding), you may want to end an experiment early. This is straightforward using NivTurk by incorporating two features into your experiment. (*Niv lab experimenters*: please see the note at the bottom of this page.)

First, you can make use of the [`jsPsych.endExperiment()`](https://www.jspsych.org/core_library/jspsych-core/#jspsychendexperiment) function. When called, this function will end a jsPsych experiment, skipping all remaining trials in the timeline. One way to invoke the endExperiment option is to use the [jspsych-call-function](https://www.jspsych.org/plugins/jspsych-call-function/) plugin. For example, the following trial might be added to a specific point in an experiment timeline:

```js
var end_experiment = {
  type: 'call-function',
  func: function() {
    if (condition) {
      low_quality = true;         // update nivturk global variable
      jsPsych.endExperiment();    // call to end experiment
    }
  }
}
timeline.push(end_experiment);
```

such that, if some condition is met (e.g. participant fails multiple attention checks or does not complete the instructions correctly), then the experiment is terminated early.

Second, you can make use of the global variable, `low_quality`, that NivTurk creates by default at the [start of an experiment](https://github.com/nivlab/nivturk/blob/prolific/app/templates/experiment.html#L42). This variable determines how a participant is handled at the end of an experiment. The relevant section of code, reproduced below, can be found in the [experiment.html](https://github.com/nivlab/nivturk/blob/prolific/app/templates/experiment.html#L47) file:

```js
jsPsych.init({
    timeline: timeline,
    on_finish: function() {
      ...
      if (low_quality) {
        {% raw %}redirect_reject("{{workerId}}", "{{assignmentId}}", "{{hitId}}", "{{code_reject}}");{% endraw %}
      } else {
        {% raw %}redirect_success("{{workerId}}", "{{assignmentId}}", "{{hitId}}", "{{code_success}}");{% endraw %}
      }
    }
  })
```
[Note: the example above is specific to the Prolific branch. Please [see here](https://github.com/nivlab/nivturk/blob/mturk/app/templates/experiment.html#L47) for the corresponding code for MTurk.]

In the above code, any participant flagged as being high quality (`low_quality = false`) will be handled as usual at the end of an experiment (e.g. given the correct completion code). Any participant flagged as being low quality (`low_quality = true`), however, will be handled differently. On Prolific, they will be returned to Prolific with a decoy completion code. On MTurk, they will be redirected to an error page (usually Error 1005).

### For Niv lab experimenters

The online behavioral experiments IRB currently specifies that online rejections must occur within the first 5-10 minutes of an experiment. That is, participants' work cannot be rejected if they have spent more than 10 minutes on an experiment. In such a situation participants must be compensated in proportion to the time spent on the task.
