---
layout: default
title: Serving experiments
parent: Detailed documentation
nav_order: 3
---

# Serving experiments

## Accessing the Server

To serve online experiments, IT has set up for us several virtual machines (VMs). To access a VM, open a terminal and SSH in:

```bash
ssh <user-name>@<server-name>.princeton.edu
```

For security reasons, we will not list the server names here. Please ask an administrator (e.g., Sam or Branson) for the server name directly.

## Installation & Environment Setup

The following steps are necessary only the first time you set up a VM or user account. These steps should not need to be repeated every time you want to serve an experiment.

To set up your environment, you first need to get a working python environment. First you need to point your user account towards the default Anaconda install (these should already be installed on the VMs):

```bash
export PATH=/opt/anaconda/bin:$PATH
echo "export PATH=/opt/anaconda/bin:$PATH" >> .bashrc
```

The commands above should only need to be run once. Next you will define a new conda environment:

```bash
conda create -n nivturk python=3.7
source activate nivturk
```

The first command will install python, and the second will activate the new environment. You should run this second command everytime you log onto the server, or you may store it in your bash_profile.

Next you need to clone NivTurk onto the server:

```bash
git clone https://github.com/nivlab/nivturk.git
```

Finally, install the required packages:

```bash
cd nivturk
pip install -r requirements.txt
```

**Do not** forget to change the password in the configuration file (`app.ini`) before running your experiment. This password encrypts the cookies so that they cannot be read by the user (though this is not foolproof; see [here](https://spring.io/blog/2014/01/20/exploiting-encrypted-cookies-for-fun-and-profit), for instance).

## Serving via [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Development)

To test out the application (but **not** to serve an actual experiment, see next section) we can use Flask's default web server. **From the nivturk folder**, run the following commands on the VM:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_RUN_PORT=9000
flask run --host=0.0.0.0
```

The first two lines tell Flask what application and in what mode to run. The third line specifies the port number. Our VMs are configured to run on ports 9000-9010. The final line starts the web server, and the `host` argument specifies to use an [externally visible server](https://flask.palletsprojects.com/en/1.1.x/quickstart/).

The example code above puts the experiment on port 9000. If you are unsure which ports are currently free for you to use, you can refer to [the relevant section](https://github.com/nivlab/nivturk/wiki/Troubleshooting#determining-if-a-port-is-in-use) of the Troubleshooting page.

## Serving via [Gunicorn](https://gunicorn.org/) (Production)

The default Flask web server is useful during development, but performs poorly for production purposes. As such, we use gunicorn as our web server for serving experiments to actual participants. Gunicorn is a pure Python application, and far more robust than Flask.

To serve an application with gunicorn, run the following command **from inside the nivturk folder**:

```bash
gunicorn -b 0.0.0.0:9000 -w 4 app:app
```

The `-b` argument specifies the host and port. Again, we are requesting an externally visible server using one of the pre-approved ports. The `-w` argument configures how many workers gunicorn will run. Four workers allows the application to handle up to four clients concurrently, which is likely able to handle a good number of clients, since not all of them are constantly requesting content. This may need to be adjusted to avoid running out of memory. Finally, `app:app` specifies which application to load.

## Accessing the Experiment

With the web server running, you (or a participant) should be able to reach the experiment by navigating to:

```
# for Prolific
http://<ip-address>:9000/?PROLIFIC_PID=<xxx>

# for TurkPrime
http://<ip-address>:9000/?workerId=<xxx>
```

For testing purposes, you will need to provide a dummy ID name so that the server lets you in.zo

To check the IP address of the server, run the following command:

```bash
curl ipecho.net/plain; echo
```

To note, the URL arguments `workerId` (on TurkPrime), `PROLIFIC_PID` (on Prolific), are not strictly necessary to reach the page. However, without a `workerId`/`PROLIFIC_PID`, the application will automatically redirect a user to the error page.

In addition, there are several additional URL arguments that specify the task ID, etc. that the webpage will receive from the recruitment website. However, if these arguments are absent NivTurk will not prevent the user from progressing.  

## Using `screen`

One issue with running the virtual machines remotely is that, if your local computer crashes or loses connection, the serving process may be interrupted mid-experiment. Luckily, there is a Unix utility called `screen` that allows a user to start, maintain, and reconnect to "detached" terminal sessions that will remain online even if the user disconnects.

To start a "detached" session, run the following command while logged onto the virtual machine:

```bash
screen -S <session-name>
```

This will start a new terminal session. From there, follow the steps above to serve an experiment. Now you are free to close the terminal (i.e. quit the terminal application); the "detached" session will stay online even if you quit!

Upon next logging onto the virtual machine, you can reconnect to the session by running:

```bash
screen -r
```

On Mac, you can end a screen session with Control + a, followed by k

## Copying the data off the server

When data collection is complete, the final task is to copy the data off the virtual machine. This can be done using a Secure Copy Protocol; in the Mac terminal this is built-in (as scp), but if you are using a Windows machine then you will need to install a separate SCP client to take care of this. You do not need to be ssh'd into the virtual machine in order to do this; instead, you can do it from your local machine, and you will then be prompted to enter your login details for the virtual machine.

On Mac, you can copy a datafile (example.json in the code below) as follows:

```bash
scp <username>@<server-name>.princeton.edu:<path/on/VM/example.json> </local/path/for/file>
```

You can also copy the entire data directory from the server with the recursive copy option:

```bash
scp -r <username>@<server-name>.princeton.edu:<path/on/VM> </local/path/for/folder>
```
