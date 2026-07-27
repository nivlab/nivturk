---
layout: default
title: Updating websites
nav_order: 1
has_children: false
parent: Upkeep
permalink: /docs/upkeep/updating-websites
---

# Updating websites
{: .no_toc }

**Last updated:** {{ page.last_modified_at | date: "%B %d, %Y" }} 

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Video Overview

<iframe
  id="tutorial-video"
  width="900"
  height="506"
  src="https://www.youtube.com/embed/pLOdAZhIhrk?enablejsapi=1"
  title="Updating Websites Tutorial"
  frameborder="0"
  allow="autoplay; encrypted-media"
  allowfullscreen
  style="display: block; margin: 0 auto;">
</iframe>


### Contents

- <a href="#" onclick="seekTo(0); return false;">00:00</a> – Overview of the websites and GitHub requirements
- <a href="#" onclick="seekTo(69); return false;">1:09</a> – Cloning repositories and opening them in Visual Studio Code
- <a href="#" onclick="seekTo(144); return false;">2:24</a> – NivTurk website overview
- <a href="#" onclick="seekTo(593); return false;">9:53</a> – Pushing changes to GitHub
- <a href="#" onclick="seekTo(741); return false;">12:21</a> – jsPsych demos website overview
- <a href="#" onclick="seekTo(1076); return false;">17:56</a> – Resources and library website overview

## Testing changes locally
- Shown on jspsych-demos, but can be applied to any of the websites.
- Ruby runs the website's build tools, and the Gemfile specifices which supporting libraries to install so the site can be built correctly.
- If you don’t have **Ruby**, install it. Make sure to get 3.x, 4.x doesn’t support some of the things we need
- Open **PowerShell** if you’re on Windows or **Terminal** if you’re on Mac.
- Type in **gem install bundler**
- Navigate to your project folder using **cd your-project-path**
- Type in **dir Gemfile**
- Type in **bundle install**
- Type in **bundle exec jekyll serve --baseurl "/jspsych-demos"**
- After this, you should be able to see an address hosting the website with the changes you’ve made.

<a href="{{ site.baseurl }}/assets/images/jspsych-image9.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/jspsych-image9.png" alt="The generated address" class="doc-image">
</a>

- Once you open the link, you should see a page like this:

<a href="{{ site.baseurl }}/assets/images/jspsych-image10.png" target="_blank">
    <img src="{{ site.baseurl }}/assets/images/jspsych-image10.png" alt="The demos website" class="doc-image">
</a>

### Subsequent testing
- Once everything is installed, it is enough to just open PowerShell/Terminal, cd into the correct folder, and run **bundle exec jekyll serve --baseurl "/jspsych-demos"**

<script src="https://www.youtube.com/iframe_api"></script>

<script>
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('tutorial-video');
}

function seekTo(seconds) {
  player.seekTo(seconds, true);
  player.playVideo();
}
</script>
