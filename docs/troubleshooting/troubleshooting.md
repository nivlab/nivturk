---
layout: default
title: Troubleshooting
nav_order: 6
has_children: false
permalink: /docs/troubleshooting
---

# Troubleshooting

This page is a running list of previous issues we have run into with their corresponding solutions.

### ModuleNotFoundError

The `gunicorn` error below indicates that you have attempted to launch the experiment from the wrong directory of your code repository. The code needs to be launched from the top directory of your repo (the one containing the `app`, `data`, and `metadata` folders.

```
ModuleNotFoundError: No module named 'app'
```

### Closing an orphaned login

If for some reason your previous SSH was disrupted (e.g. internet connection issues) and a previous instance of your account is still logged in, follow the instructions from [this thread](https://superuser.com/questions/193168/how-can-i-logout-an-open-remote-ssh-session):

> Run `tty` on your current session, to find out on which tty you are working, so you do not log yourself out from current session. Run `w` to show you current users and associated pseudo-terminals (`tty`). Assuming that you are logged twice and there are no other users on your ssh server, your previous ssh session will be on `pts/0` and current on `pts/1`. To ditch the session on `pts/0` simply kill processes that are associated to it with:

```bash
pkill -9 -t pts/0
```

### Determining if a port is in use

If you are not sure whether a server is still open (i.e., listening) on a particular port, you can check using the netstat utility. Since our experiments run on ports 9000-9010, we can filter out non-experiment ports using regular expressions:

```bash
netstat -plnt | grep ':90*'
```

If you see a port listed with a state of LISTEN, (e.g., port 9001 in the screenshot below), that means the port is still open, and therefore unavailable for you to use. If a port is not listed, it is free.

![open_port](https://user-images.githubusercontent.com/15354053/69742668-274ea780-110b-11ea-81d8-5f889907ed46.png)

### Closing an orphaned port

If for some reason a process is still running on some port, despite all accounts having logged off, you can also kill that process if you know its process ID (PID). You can find out the process ID by following the instructions in the **Determining if a port is in use** section above. In that example, the PID is 87896. You can kill this process as follows:

```bash
kill -9 87896
```
