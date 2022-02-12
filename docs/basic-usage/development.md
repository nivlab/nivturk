---
layout: default
title: Developing experiments
parent: Basic Usage
nav_order: 2
---

## Serving via [Flask](https://flask.palletsprojects.com/en/1.1.x/){:target="_blank"} (Development)

To test out the application (but **not** to serve an actual experiment, see next section) we can use Flask's default web server. **From the nivturk folder**, run the following commands on the VM:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_RUN_PORT=9000
flask run --host=0.0.0.0
```

The first two lines tell Flask what application and in what mode to run. The third line specifies the port number. Our VMs are configured to run on ports 9000-9010. The final line starts the web server, and the `host` argument specifies to use an [externally visible server](https://flask.palletsprojects.com/en/1.1.x/quickstart/).

The example code above puts the experiment on port 9000. If you are unsure which ports are currently free for you to use, you can refer to [the relevant section](../../troubleshooting#determining-if-a-port-is-in-use) of the Troubleshooting page.
