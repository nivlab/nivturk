---
layout: default
title: Upgrading NivTurk
nav_order: 1
parent: Changing jsPsych versions
grand_parent: Upkeep
permalink: /docs/upkeep/changing-jspsych/nivturk
---
# Upgrading NivTurk to a new version of jsPsych
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---
## When is (and isn't) a good time to upgrade

The version currently in NivTurk is **7.2.1**. We are upgrading to **8.2.3**. There is not much use in upgrading every time a new update is released, with the only exception being specific bugs that were resolved. You should upgrade when a new version is released, because those mark larger changes in the framework. Plan to upgrade when **version 9** (marked by 9.x.x) is published.

## Finding the correct version
- Download the latest version of jsPsych from the [**jsPsych releases**](https://github.com/jspsych/jsPsych/releases). Look up the version number, there’s a lot of releases and it can be hard to locate!
- Once you find it, expand the Assets tab and download the **Dist Archive (zip)**

![Locating the Dist Archive]({{ site.baseurl }}/assets/images/upgrading-nivturk-image1.png)

## Making the new jsPsych folder
-If you’re a new lab member, Yael for access to the [**NivLab GitHub repository**](https://github.com/nivlab). Once you have access, you can use GitHub Desktop and Visual Studio Code for easy access on your local device.
-Navigate to the [**NivTurk repository**](https://github.com/nivlab/nivturk) - this is where the jsPsych changes will take place. 
-Find the app/static/lib/**jspsych-x.x.x** folder. You want to create a new folder on your personal computer that has the same outline as this one, but using the distribution files from the new version you downloaded. It is extremely important that you **have all of the files** that the version on GitHub has. If something is missing, see [Obtaining missing files](#obtaining-missing-files).
-If there are files that exist in the new distribution, but not in the GitHub repository, you most likely **do not need to include them**. You can ask someone if it seems like the file could be useful.

![Making the new jsPsych folder]({{ site.baseurl }}/assets/images/upgrading-nivturk-image2.png)

## Obtaining missing files 


