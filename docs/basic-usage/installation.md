---
layout: default
title: Download & install
parent: Basic Usage
nav_order: 1
---

# Downloading & installing NivTurk
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Downloading NivTurk

NivTurk is available for download on [Github](https://github.com/nivlab/nivturk){:target="_blank"}. There are multiple versions of NivTurk available, each compatible with a different participant recruitment platform (e.g. Prolific, MTurk, SONA). Be careful to download the correct version for your experiment plan.

### Zip files

To download a specific version of NivTurk, you can use one of the following links:<br>
[Prolific](https://github.com/nivlab/nivturk/archive/refs/heads/prolific.zip) | [MTurk](https://github.com/nivlab/nivturk/archive/refs/heads/mturk.zip) | [SONA](https://github.com/nivlab/nivturk/archive/refs/heads/sona.zip)

### Git clone

If you are comfortable using the command line, you can also clone a version of NivTurk:

```bash
git clone https://github.com/nivlab/nivturk.git --single-branch --branch prolific
git clone https://github.com/nivlab/nivturk.git --single-branch --branch mturk
git clone https://github.com/nivlab/nivturk.git --single-branch --branch sona
```

---

## Configuring your environment

The following steps are necessary to complete only once. These steps do not need to be repeated every time you want to serve an experiment.

### PNI virtual machines (Niv / Daw labs only)

If you are first getting started on the Niv / Daw lab virtual machines, you need to set up a working python environment. To do so, you need to point your user account towards Anaconda install:

```bash
export PATH=/opt/anaconda/bin:$PATH
echo "export PATH=/opt/anaconda/bin:$PATH" >> .bashrc
```

The commands above only need to be run once. Next you will define a new conda environment:

```bash
conda create -n nivturk python=3.7
source activate nivturk
```

The first command will install python, and the second will activate the new environment. You will need to run this second command everytime you log onto the server. Alternately, you may add it to your bash profile by running the following:

```bash
echo "source activate nivturk" >> .bashrc
```

### All other environments

We recommend using a separate [conda environment](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html){:target="_blank"} for running experiments using NivTurk.

---

## Installing dependencies

Once you have NivTurk downloaded and your environment configured, you can install its dependencies:

```bash
cd nivturk
pip install -r requirements.txt
```
