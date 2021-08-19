---
layout: default
title: Message passing
parent: Cookbook
nav_order: 1
---

# Message Passing

By default, NivTurk collects no information between the moment a participant first reaches the experiment page and subsequently when the participant is redirected away (e.g. on completion of or rejection from the experiment). You may want, however, to log certain events during an active experiment such as when a participant finishes the instructions or starts the first block of a task.

This is easy to do by using the `pass_message` function found in [nivturk-plugins](https://github.com/nivlab/nivturk/blob/prolific/app/static/js/nivturk-plugins.js). When called during an experiment, the `pass_message` function writes a user-defined message to a participant's metadata file.

For example, a message can be passed at the start of an event using jsPsych's `on_start` callback function:

```js
var trial = {
  type: 'image-keyboard-response',
  stimulus: 'imgA.png',
  on_start: function(trial) {
    pass_message('starting trial')
  }
};
```

Similarly, a message can be passed at the start of an event using jsPsych's `on_finish` callback function:

```js
var trial = {
  type: 'image-keyboard-response',
  stimulus: 'imgA.png',
  on_finish: function(data) {
    pass_message('finished trial')
  }
};
```
