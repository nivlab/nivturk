---
layout: default
title: Serving experiments
parent: Basic Usage
nav_order: 3
---

# Serving experiments
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Log onto the server

### PNI virtual machines (Niv / Daw labs only)
{: .no_toc }

In the Niv & Daw labs, we have several virtual machines (VMs) available for the purpose of running online experiments. To log onto a VM, open a terminal and SSH in:

```bash
ssh <user-name>@<server-name>.princeton.edu
```

For security reasons, we will not list the server names here. Please ask an administrator (e.g., Sam or Dan) for the server names. Note: you need to be on the Princeton VPN to access the VMs.

### All other users
{: .no_toc }

Log onto your server as normal.

---

## Copy your experiment onto the server

### From Github
{: .no_toc }

If you are hosting your code on Github, you can clone your experiment directly onto the server by running the following command <i>from the server</i>:

```bash
git clone <repo-url>.git
```

### From your local machine
{: .no_toc }

If your code is only available on your local machine, you can copy over your experiment with the following command <i>from your local machine:</i>

```bash
scp -r <path-to-local-directory> <user-name>@<server-address>:<path-to-new-directory>
```

See [here](https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/) for a detailed explanation of the command above.

---

## Configure your experiment

Before launching your experiment, you need to modify the NivTurk configuration file ([`app.ini`](https://github.com/nivlab/nivturk/blob/prolific/app/app.ini)).

### Set the secret key

Set a secret key in the configuration file ([Line 5](https://github.com/nivlab/nivturk/blob/prolific/app/app.ini#L5)). The secret key can be a random string of alphanumeric characters (e.g. from [randomkeygen.com](https://randomkeygen.com/)). The key encrypts cookies so that they cannot be read by participants (though this is not foolproof; see [here](https://spring.io/blog/2014/01/20/exploiting-encrypted-cookies-for-fun-and-profit){:target="_blank"}).

### Turn off debug mode

Turn off debug made in the configuration file ([Line 9](https://github.com/nivlab/nivturk/blob/prolific/app/app.ini#L9)). This is accomplished by setting `DEBUG = false`. This prevents cookies from being reset on every new page visit (for details see [here](../development/#debug-mode)).

### Set completion codes (Prolific only)

If you are running your experiment on Prolific, set the completion code ([Line 15](https://github.com/nivlab/nivturk/blob/prolific/app/app.ini#L15)). This code should be provided to you by Prolific (for details see [here](../prolific/#study-completion)). You may also change the dummy code ([Line 19](https://github.com/nivlab/nivturk/blob/prolific/app/app.ini#L19)) though this is not required.

---

## Start a detached screen

One issue with running experiments on the servers is that, if you lose connection to the server for any reason, the serving process may be interrupted mid-experiment. One way to prevent this is to use "detached" terminal sessions that will remain online even if you disconnect from the server.

To start a "detached" session, run the following command while logged onto the virtual machine:

```bash
screen -S <session-name>
```

This will start a new terminal session. From here, follow the steps below to serve an experiment. When the experiment is online, you will be free to close the terminal (i.e. quit the terminal application); the "detached" session will stay online even if you quit!

Upon next logging onto the virtual machine, you can reconnect to the session by running:

```bash
screen -r
```

Instead of `screen`, you may also use `tmux`. See [here](https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/) for a tutorial.

---

## Serve your experiment

### Identify an open port

Before you serve an experiment, you must first identity an open port on which to host the experiment. The PNI virtual machines have 10 ports configured for serving experiments (ports 9000-9010).

To check which ports are in use, you can check using the `netstat` utility:

```bash
netstat -plnt | grep ':90*'
```

Any ports that are returned by the command above are ports currently in use and therefore unavailable for you to use. If a port is not listed, it is free.

![open_port](https://user-images.githubusercontent.com/15354053/69742668-274ea780-110b-11ea-81d8-5f889907ed46.png)

In the example above, you can see that port 9001 is in active use and unavailable for others to use.

### Start the gunicorn server

Once you have identified a port to use, you are ready to serve your experiment. We use [gunicorn](https://gunicorn.org/) as our web server client for serving experiments over the web.

First, if applicable, source your NivTurk python environment:

```bash
source activate nivturk
```

Next, serve the experiment by running the following command from inside the NivTurk folder:

```bash
cd <nivturk-folder>
gunicorn -b 0.0.0.0:9000 -w 4 app:app
```

The `-b` argument specifies the host and port (e.g. port 9000). The `-w` argument configures how many workers gunicorn will run. In general, four workers should be sufficient to handle hundreds to thousands of requests per second (for discussion, see [here](https://docs.gunicorn.org/en/0.16.1/design.html#how-many-workers){:target="_blank"}). Finally, `app:app` specifies which application to load.

### Accessing the experiment

With the web server running, you (or a participant) should be able to reach the experiment by navigating to:

```
# for Prolific
http://<ip-address>:9000/?PROLIFIC_PID=<xxx>

# for MTurk
http://<ip-address>:9000/?workerId=<xxx>
```

For testing purposes, you will need to provide a dummy ID so that NivTurk lets you continue.

To check the IP address of the server, run the following command:

```bash
curl ipecho.net/plain; echo
```

To note, the URL arguments `workerId` and `PROLIFIC_PID` are not strictly necessary to reach the page. However, without these the application will automatically redirect a user to the error page.

To note, there are several additional URL arguments (e.g. task ID) that the NivTurk will normally receive from the recruitment website. However, if these arguments are absent NivTurk will not prevent the user from progressing.

---

## Closing your experiment

When you are finished collecting data, it is important to close down your gunicorn instance in order to free up its port for other experimenters (and to minimize security risks).

### Closing a `screen` instance

If you have gunicorn running in a detached screen, you can reconnect to a previous `screen` session using:

```bash
screen -r <session-name>
```

To check for all of the detached sessions you have running, you can use the command:

```bash
screen -ls
```

Once connected to your screen session, you should interrupt the gunicorn process. For example, on Mac, you can usually interrupt a terminal process by pressing `cmd + .`.

Once your gunicorn process has been interrupted, you can close the screen instance by running:

```bash
exit
```

### Killing an orphaned process

If you are not sure whether a gunicorn server is still open on a particular port, you can check using the `netstat` utility:

```bash
netstat -plnt | grep ':90*'
```

If you see a port listed with a number in the rightmost column (e.g., port 9001 in the screenshot below), that means you still have active processes running on that port.

![open_port](https://user-images.githubusercontent.com/15354053/69742668-274ea780-110b-11ea-81d8-5f889907ed46.png)

You end an orphaned process, and free up its port, by using the `kill` command. Using the example above, we could end the orphaned process by running the command below:

```bash
kill -9 87896
```

where 87896 is the process' PID number as identified by running the `netstat` command.

---

## Copy data off the server

When data collection is complete, the final task is to download the data off the server. You do not need to be on the server in order to do this; instead, you can do it from your local machine.

On Mac, you can copy a datafile (example.json in the code below) as follows:

```bash
scp <username>@<server-address>:<path/on/VM/example.json> </local/path/for/file>
```

You can also copy the entire data directory from the server with the recursive copy option:

```bash
scp -r <username>@<server-name>.princeton.edu:<path/on/VM> </local/path/for/folder>
```
