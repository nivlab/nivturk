---
layout: default
title: Upgrading experiments
nav_order: 2
parent: Changing jsPsych versions
grand_parent: Upkeep
permalink: /docs/upkeep/changing-jspsych/demos
---
# Upgrading experiments to a new version of jsPsych
{: .no_toc}

**Last updated:** {{ page.last_modified_at | date: "%B %d, %Y" }} 

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Before you upgrade
- The version currently in NivTurk is **7.2.1** in the Prolific branch (**8.2.3** in the v8 branch, release to main branch pending). There is not much use in upgrading every time a new update is released, with the only exception being specific bugs that were resolved. You should upgrade when a new version is released, because those mark larger changes in the framework. Plan to upgrade when **version 9** (marked by 9.x.x) is published.

- If you're working on upgrading jspsych-demos, set up a meeting with Yael to discuss them. Are there any demos that should be deprecated? Are there any demos that should be added? Make a list of proposed changes. The example seen below is taken from jspsych-demos.

## Making changes in the experiment.html file
- The main changes you will be making are to the **&lt;script&gt;** tags. 
- First, identify all &lt;script&gt; tags that have https://unpkg.com in them. For these scripts, we will need to go to the jsPsych website to identify if everything is up to date.
- Second, identify all &lt;script&gt; tags that have ./js/ in them. These are local scripts that exist in the js folder of the experiment. Here, we’re manually checking the code for any changes that need to be made.

<a href="{{ site.baseurl }}/assets/images/jspsych-image5.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/jspsych-image5.png" alt="Differences between local and unpkg.com scripts" class="doc-image">
</a>

### Updating unpkg.com scripts
- The first script that you will see in experiment.html is usually the import for the jsPsych library itself, marked as https://unpkg.com/**jspsych@x.x.x**. You’ll need to change the version number to the most up-to-date version of jsPsych. In my case, I’ll just replace 7.3.3 with 8.2.3.
- The next scripts are **jsPsych plugins**, marked as https://unpkg.com/**@jspsych/plugin-name@x.x.x**. Look at the URL in the script to figure out what plugin you’re looking for. For example,  

```html
<script src="https://unpkg.com/@jspsych/plugin-instructions@1.1.3"></script>
``` 
is loading the instructions plugin, version 1.1.3.
- Go to [the jsPsych website](https://www.jspsych.org/latest/plugins/list-of-plugins/) to find the list of all plugins. Locate the plugin you’re looking for, click on its corresponding page, and the script to use in the **Install section**.

<a href="{{ site.baseurl }}/assets/images/jspsych-image6.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/jspsych-image6.png" alt="Getting the correct script from the jsPsych website" class="doc-image">
</a>

- The most current version of the instructions plugin is 2.1.0, so we should update the script in our code to reflect this new version. Repeat this for all plugins.
- You might also see **CSS styles** being loaded, marked as https://unpkg.com/**jspsych@x.x.x/css/jspsych.css**. Replace the version number with the most up-to-date version of jsPsych. In my case, I’ll just replace 7.3.3 with 8.2.3.
Save these changes.

### Updating local scripts
- Sometimes there are no changes in code necessary. Before starting to inspect code in the js folder, check if the demo is still working. 
- Navigate to the [demos website](https://nivlab.github.io/jspsych-demos/), find the demo that you’re working on, and play it so that you know what to expect.  
- After that, go to Visual Studio Code, right click on experiment.html, and click on Open In Integrated Browser. This will let you test the task before pushing any changes. Alternatively, you could use the method described in [Testing Changes Locally](#testing-chages-locally) to get the experiment to open in a browser.

<a href="{{ site.baseurl }}/assets/images/jspsych-image7.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/jspsych-image7.png" alt="How to open in integrated browser" class="doc-image">
</a>

- If the task is behaving strangely, use **right click and inspect** in the integrated browser to get more information about potential errors and warnings. This will open a separate Developer Tools window.

<a href="{{ site.baseurl }}/assets/images/jspsych-image8.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/jspsych-image8.png" alt="How to inspect" class="doc-image">
</a>

- Inspect for **suspicious behavior**. See the [common errors]({{ site.baseurl }}/docs/upkeep/changing-jspsych/common-errors) page for debugging ideas and potential fixes.







