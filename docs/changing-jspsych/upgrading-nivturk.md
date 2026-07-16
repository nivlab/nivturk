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







