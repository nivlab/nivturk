---
layout: default
title: Error Codes
nav_order: 6
parent: Detailed documentation
has_children: false
---

# Error Codes

NivTurk anticipates specific errors that may arise during the course of an experiment. This section details those errors and the corresponding error messages participants see.

<br>
### [Code: 1000] Missing workerId

```
Sorry, we are missing your Prolific ID. Please start the experiment over from the Prolific link.
```

This error is triggered if:
- The participant lands on the experiment start page without a worker ID (`workerID` for MTurk; `PROLIFIC_PID` for Prolific) embedded in the URL
- The participant navigates to any other page of the study (`/consent.html`, `/alert.html`, `/experiment.html`, etc.) without a valid workerID written into their Flask session variable

<br>
### [Code: 1001] Unsupported platform

```
We have detected you may be using a mobile or tablet device. Our experiment requires a
desktop device.

Please return the study or try again on a desktop computer or laptop.
```

This error is triggered if a query of the user's metadata reveals that they are using a non-desktop Operating System.

<br>
### [Code: 1002] Decline consent

```
We are sorry you do not wish to complete this study.

Please return the study so someone else can perform the experiment.
```

This error is triggered if the participant indicates that they do not consent on the consent form page.

<br>
### [Code: 1003] Technical issue

```
Sorry, there was a technical error in our processing of your study. Most likely this means
an important component of the experiment failed to load.

If you would like to receive partial compensation, or feel you have reached this page in error,
please send us a message on Prolific describing the error that you experienced.
```

This error can be triggered if there is a technical error associated with the loading of study materials (video clips, etc.).

Note that in the default NivTurk code, there is no route to this error message. Instead, it is included as a convenience so that advanced users have the option of redirecting to this webpage from within JSPsych.

<br>
### [Code: 1004] Previous participation

```
Sorry, our records indicate that you have already completed (or attempted to complete) this study.
If you have not previously completed the study, you may have reached this page because you pressed
refresh, back, or opened the study in a new browser window.

Because this is a psychology experiment, you can only complete this study once, and you cannot
restart the study if you have previously begun it. Please return the study so someone else can
perform the experiment.

If you would like to receive partial compensation, or if you have reached this page following an
error, please send us a message on Prolific describing the error that you experienced.
```

This is one of the most commonly occurring errors. It occurs when the participant attempts to access the experiment despite there being a previous record of their participation (either in the Flask session variable or in the server's metadata folder).

Sometimes this occurs when a participant attempts to refresh the page after a technical problem with the experiment. At other times, adversarial workers will deliberately refresh the webpage (despite being instructed not to in `alert.html`) to trigger an error and claim compensation.

A third possibility is that this error will occur if the participant logs out of one Prolific account and into another account in the same browser window. In this case, the record of participation in the Flask session variable should prevent them from accessing the study.
<br>
### [Code: 1005] Suspicious activity

```
We have detected unusual or noncompliant activity from your account. Most likely this means we
detected you were responding randomly or showing a lack of engagement with the task. Please note
that if we detect similar behavior from your account in the future, you may be permanently excluded
from all future experiments.

If you would like to receive partial compensation, or if you have reached this page following an
error, please send us a message on Prolific describing the error that you experienced.

Please return the study so someone else can perform the experiment.
```

This is a catch-all error displayed if participants somehow break the internal logic of the experiment, or otherwise trigger internal quality control metrics. It occurs very sporadically, and should be taken seriously when it occurs.
