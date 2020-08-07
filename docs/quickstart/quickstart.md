---
layout: default
title: Quickstart
nav_order: 2
has_children: false
permalink: /docs/quickstart
---

# Quickstart

The following is the minimal set of commands needed to get started with NivTurk (assuming you have already a virtual machine with python 3.6+ installed).

- First, `ssh` into the virtual machine (replacing the variables in \<angle brackets\> as appropriate):

```
ssh <user-name>@<server-name>.princeton.edu
```
<sub>For security reasons, we will not list the server names here. Please ask an administrator (e.g., Yael, Sam) for the server name directly.</sub>

- Next, we clone the git repo containing the experiment code (the URL below is a default experiment that can be used for server testing):
```
git clone https://github.com/nivlab/nivturk.git
```

- Move into the experiment directory:
```
cd nivturk
```

- Install the `nivturk` dependencies:
```
pip install -r requirements.txt
```

- And lastly, use `gunicorn` to launch the study.
```
gunicorn -b 0.0.0.0:<port-number> -w <n-workers> app:app
```

<sub>On our virtual machines, we use a `port-number` between 9000 and 9009. `n-workers` should be adjusted based on the expected server load, but 4 has been a reasonable default value in our usage to date.</sub>

{: .fs-6 .fw-300 }
