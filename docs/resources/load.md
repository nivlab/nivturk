---
layout: default
title: Load Testing
parent: Resources
nav_order: 2
---

# Load Testing

One problem we risk when running experiments online is serving the experiment to too many participants at once and overloading the server. If the server becomes overloaded, the experiment may fail to load or participants may be kicked out mid-session, resulting in many angry emails. To prevent this, we need to get a sense of how robust our server is and how many participants we can serve at once. This is where **load testing** comes in.

As the name suggests, **load testing** is a method that measures approximately how many concurrent users a system can handle. To do this, we make use of [Locust](https://locust.io/){:target="_blank"}. In their own words,

> Locust is an easy-to-use, distributed, user load testing tool. The idea is that during a test, a swarm of locusts will attack your website. The behavior of each locust (or test user if you will) is defined by you and the swarming process is monitored from a web UI in real-time. This will help you battle test and identify bottlenecks in your code before letting real users in.

The `load-test` branch of the NivTurk repository has some basic Locust code written and ready for load testing a virtual machine. The following are step-by-step instructions for deploying the code and running a test.

## Step 1: Clone Branch and Serve Experiment

After [logging into the server](../../detailed-documentation/serving){:target="_blank"}, clone the `load-test` branch into your testing environment:

```bash
git clone --single-branch --branch load-test https://github.com/nivlab/nivturk.git
```

Next, deploy the test experiment.

```bash
cd nivturk
gunicorn -b 0.0.0.0:9000 -w 4 app:app
```

Note that this experiment contains no jsPsych and contains only the usual consent and completion pages (for details, see below).

## Step 2: Initialize Locusts.io

On your local computer, you may either clone the `load-test` branch (following the instructions above) or download only the _locusts.py_ file (found in /locusts/locusts.py). This single file contains all of the Locust code that you will use.

If you have not done so already, install Locust on your local computer.

```bash
pip install locustio
```

To run Locust with the above Locust file, open a terminal and run:

```bash
locust -f /path/to/locusts.py
```

Once you’ve started Locust using one of the above command lines, you should open up a browser and point it to http://127.0.0.1:8089. You should be greeted with [Locust's web interface](https://docs.locust.io/en/stable/quickstart.html#open-up-locust-s-web-interface){:target="_blank"}.

## Step 3: Deploy the Swarm

To run the load test, specify the host (i.e. experiment link) and decide on the number of bots and their spawn rate. After, run the test. Pay attention to the number of requests per second (RPS) and the number of failures. Ideally, the server should be able to handle a large RPS and should exhibit 0 failures (even under considerable strain).

## Notes

As alluded to above, the current `load-test` branch contains only the simplest Flask experiment. Specifically, it involves only two webpages (consent, complete) and three IO calls (write initial metadata, update metadata on complete, write data on complete). As such, the current branch is designed only to test the most essential functionality.

It is possible to write more advanced tests (e.g. load test for displaying videos). To learn more about how to write more advanced tests, please see the [Locust documentation](https://docs.locust.io/en/stable/index.html){:target="_blank"}. Moreover, it may be helpful to read more into the [Requests](https://requests.readthedocs.io/en/master/){:target="_blank"} package, around which Locusts is built.

Finally, please note that it is currently not possible via Requests/Locusts to test jsPsych experiments. This is because Requests is designed to work exclusively with HTML, and not with JavaScript. If you attempt to test jsPsych experiment with Locusts, it will hang indefinitely (i.e. the jsPsych experiment will not start). If you are interested in load-testing a jsPsych experiment directly, you will need to use a headless browser automation library (e.g. [pyppeteer](https://miyakogi.github.io/pyppeteer/){:target="_blank"}). Note that these are computationally intensive -- they run GUI-less instances of a browser, e.g. Chrome -- thereby making it challenging to load test with many, many bots at once. In additionally, Locusts is not compatible with headless browsers, so the user will need to write their own bot deployment software.
