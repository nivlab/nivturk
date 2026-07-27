---
layout: default
title: Common errors when migrating from v7 to v8
nav_order: 3
parent: Changing jsPsych versions
grand_parent: Upkeep
permalink: /docs/upkeep/changing-jspsych/common-errors
---

# Common errors when migrating from v7 to v8
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Specify if a parameter is an array
- Seeing warnings about non-string or non-numeric values in your console, next to an array of strings or integers, means that you have not specified that your parameter is an array.
- Specify that the parameter is an array by setting **array:true** in your initialization

<a href="{{ site.baseurl }}/assets/images/errors-image1.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image1.png" alt="Fixing the array error" class="doc-image">
</a>

## Initialize all parameters properly
- If something isn’t loading, but you see no other warnings in the console, you might not be initializing all of your parameters. Add a **console log in your trial loop** to check for errors with parameters.

<a href="{{ site.baseurl }}/assets/images/errors-image2.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image2.png" alt="Adding trial log into the code" class="doc-image">
</a>

- Look at your console log results. Seeing {name: ‘variable-name’} instead of a value generally means that your **variable is not initialized**.

<a href="{{ site.baseurl }}/assets/images/errors-image3.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image3.png" alt="Looking for uninitialized variables" class="doc-image">
</a>

- Initialize the missing values by adding them to the proper slot in your code. Because these were trial parameters, they need to be added to **info.parameters**.

<a href="{{ site.baseurl }}/assets/images/errors-image4.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image4.png" alt="Initializing variables" class="doc-image">
</a>

## Pass and assign correct values to parameters
- You can find a full list of supported parameter types [here](https://www.jspsych.org/latest/developers/plugin-development/?utm_source=chatgpt.com#parameter-types).
- If a parameter is expecting a numeric value, you have to pass a numeric value. Similar principles apply to every value type. These errors will show up as, for example “a non-numeric value was provided for the numeric parameter” in your warnings.
- Check for numbers in character/string form, such as ‘10’ instead of 10.
- Assign your value types correctly. If we’re passing “up”/”down” to a parameter, it should be a string parameter rather than a numeric parameter.

<a href="{{ site.baseurl }}/assets/images/errors-image5.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image5.png" alt="Assigning proper values to parameters." class="doc-image">
</a>

- **NaN (not a number) errors** can also happen due to this. They occur when we’re trying to pass a string value to a numeric parameter. They may look like this in the console:

<a href="{{ site.baseurl }}/assets/images/errors-image6.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image6.png" alt="NaN error." class="doc-image">
</a>

## Normalize key presses
- If a key press is not working in your experiment, the issue may be that different browsers or devices label the same key in different ways. For example, the left arrow key might be recorded as "ArrowLeft" in one case and "arrowleft" in another. To avoid this, normalize key presses by converting all key inputs to the same format before checking them.
- Make the default responses lowercase, and set user inputs to lowercase before further analysis.

<a href="{{ site.baseurl }}/assets/images/errors-image7.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image7.png" alt="Normalizing key presses." class="doc-image">
</a>

## Change `endExperiment()` to `abortExperiment()`
- `endExperiment()` is no longer supported as a function. If you’re having this problem, you might see something like this in your developer console:

<a href="{{ site.baseurl }}/assets/images/errors-image8.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/errors-image8.png" alt="End experiment error." class="doc-image">
</a>

- Change `endExperiment()` to `abortExperiment()` in your code. Same applies to `endCurrentTimeline()`. Change it to `abortCurrentTimeline()`.

## Changes to playing audio
- No need for `audioContext()` anymore, code is much simpler.
- `getAudioBuffer()` is no longer supported as a function. If you’re still using it, you will see an error in your developer console. Make the following changes in your code:

```javascript
// *** initialization ***
// var context = jsPsych.pluginAPI.audioContext(); 
// No need for audioContext anymore, remove it.

var audio_ix = jsPsych.randomization.sampleWithReplacement([0,1,2,3], 1);
var audio = null;
var starttime;

// *** load audio file ***
jsPsych.pluginAPI.getAudioPlayer(trial.stimulus[audio_ix])
  .then(function (player){
      audio = player;
  })
  .catch(function (err){
      console.error("Failed to load audio file");
      console.error(err);
  });

// *** start audio ***
audio.play();

// *** stop audio ***
audio.stop();
```

## Optional for v8: change the outline of your plugins
<video width="400" controls style="display: block; margin: 0 auto;">
  <source src="/nivturk/assets/videos/outline-video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
