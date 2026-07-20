---
layout: default
title: Upgrading NivTurk
nav_order: 1
parent: Changing jsPsych versions
permalink: /docs/changing-jspsych/nivturk
---
# Upgrading NivTurk to a new version of jsPsych
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---
## When is (and isn't) a good time to upgrade

- The version currently in NivTurk is **7.2.1**. We are upgrading to **8.2.3**. There is not much use in upgrading every time a new update is released, with the only exception being specific bugs that were resolved. You should upgrade when a new version is released, because those mark larger changes in the framework. Plan to upgrade when **version 9** (marked by 9.x.x) is published.

## Finding the correct version
- Download the latest version of jsPsych from the [jsPsych releases](https://github.com/jspsych/jsPsych/releases). Look up the version number, there’s a lot of releases and it can be hard to locate!
- Once you find it, expand the Assets tab and download the **Dist Archive (zip)**

<a href="{{ site.baseurl }}/assets/images/nivturk-image1.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image1.png" alt="Locating the Dist Archive" class="doc-image">
</a>

## Making the new jsPsych folder
- If you’re a new lab member, Yael for access to the [NivLab GitHub repository](https://github.com/nivlab). Once you have access, you can use GitHub Desktop and Visual Studio Code for easy access on your local device.
- Navigate to the [NivTurk repository](https://github.com/nivlab/nivturk) - this is where the jsPsych changes will take place. 
- Find the app/static/lib/**jspsych-x.x.x** folder. You want to create a new folder on your personal computer that has the same outline as this one, but using the distribution files from the new version you downloaded. It is extremely important that you **have all of the files** that the version on GitHub has. If something is missing, see [Obtaining missing files](#obtaining-missing-files).
- If there are files that exist in the new distribution, but not in the GitHub repository, you most likely **do not need to include them**. You can ask someone if it seems like the file could be useful.

<a href="{{ site.baseurl }}/assets/images/nivturk-image2.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image2.png" alt="Making the new jsPsych folder" class="doc-image">
</a>

## Obtaining missing files 
- Sometimes, the distribution you downloaded may not include all of the plugins that you see in the GitHub folder. This does not mean that they don’t exist. There may be cases where a plugin becomes deprecated, but this is very rare and will definitely be mentioned. In most cases, you can easily find them.
- **Identify the missing plugins** by comparing the the folder that you made with the jspsych folder on GitHub 

<a href="{{ site.baseurl }}/assets/images/nivturk-image3.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image3.png" alt="Comparing the plugins of the two folders" class="doc-image">
</a>

- Go to the [list of plugins on the jsPsych website](https://www.jspsych.org/v8/plugins/list-of-plugins/). Make sure you’re selecting the correct version!

<a href="{{ site.baseurl }}/assets/images/nivturk-image4.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image4.png" alt="Selecting the correct version of jsPsych" class="doc-image">
</a>

- Click on the missing plugin. In the Install portion of the page, copy the **unpkg.com** link into your browser and run.

<a href="{{ site.baseurl }}/assets/images/nivturk-image5.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image5.png" alt="Getting the correct URL" class="doc-image">
</a>

- You should see a JavaScript file. It may look smushed together - **remove the .min** from the link and reload the page for a better print. 

Here's how the website looks with the .min:

<a href="{{ site.baseurl }}/assets/images/nivturk-image7.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image7.png" alt="Site with .min" class="doc-image">
</a>


And here's what to expect without it:

<a href="{{ site.baseurl }}/assets/images/nivturk-image7.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/nivturk-image7.png" alt="Site without .min" class="doc-image">
</a>

## Testing
- Download a local copy of the current version of NivTurk:<br>
[Prolific](https://github.com/nivlab/nivturk/archive/refs/heads/prolific.zip) | [MTurk](https://github.com/nivlab/nivturk/archive/refs/heads/mturk.zip) | [SONA](https://github.com/nivlab/nivturk/archive/refs/heads/sona.zip)
- Replace the old jsPsych folder with the new one you have created
- Open the jspsych-demos codebase and chose an experiment you want to test with (in this case, Modified Risk Sensitivity Task)
- Follow the guidelines in [Developing experiments](https://nivlab.github.io/nivturk/docs/basic-usage/development/) to make the experiment compatible with NivTurk. Make sure to:
    - Move the files from the css, img, and js folders into the corresponding folders in app/static
    - Copy experiment.html from jspsych-demos into experiment.html in NivTurk

    <a href="{{ site.baseurl }}/assets/images/nivturk-image8.png" target="_blank">
        <img src="{{ site.baseurl }}/assets/images/nivturk-image8.png" alt="Mrst folder" class="doc-image">
    </a>

    <a href="{{ site.baseurl }}/assets/images/nivturk-image9.png" target="_blank">
        <img src="{{ site.baseurl }}/assets/images/nivturk-image9.png" alt="Mrst folder ported into NivTurk" class="doc-image">
    </a>

    - Ensure that the local scripts are pointing to the correct location.

    <a href="{{ site.baseurl }}/assets/images/nivturk-image10.png" target="_blank">
        <img src="{{ site.baseurl }}/assets/images/nivturk-image10.png" alt="Updating local script locations" class="doc-image">
    </a>

    - For jsPsych related imports, update experiment.html to use local scripts and not unpkg.com. 

    <a href="{{ site.baseurl }}/assets/images/nivturk-image11.png" target="_blank">
        <img src="{{ site.baseurl }}/assets/images/nivturk-image11.png" alt="Updating jspsych plugin locations" class="doc-image">
    </a>
- Run the experiment using guidelines in [Developing experiments](https://nivlab.github.io/nivturk/docs/basic-usage/development/) and ensure that everything works correctly.
- Repeat for a few more demos as well as other experiments in the lab to ensure that everything is working correctly. Note that any experiment you are testing on needs to be ported over to jsPsych v8 beforehand.

## Pushing changes
- Once everything is working correctly, create a new branch on the NivTurk repository. 
- Commit and push the updated jsPsych folder to this repository. **Do not push to the main branch** - people are still using the previous version of jsPsych!
- Notify people about the change, and hold an info session on what changed with the new version on jsPsych, as well as how to port experiments over. 






