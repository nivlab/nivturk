---
layout: default
title: Multiple restarts
parent: Cookbook
nav_order: 3
---

# Multiple restarts

By default, NivTurk does not allow participants to restart or refresh the experiment page -- if they do so, they will be redirected to an error page and unable to access the experiment. In some situations, it may be desirable to allow participants to restart an experiment (e.g. before they reach the main experiment, if images fail to load, etc.). Allowing for restarts -- up until some point in the experiment -- requires several modifications to NivTurk's architecture.

First, a small change needs to be made to the case handling in `/app/__init__py`. Specifically, the keyword "experiment" in [line 91](https://github.com/nivlab/nivturk/blob/prolific/app/__init__.py#L91) needs to be replaced with some other search term. As an example, the keyword might be replaced by the word "block":

```python
## Case 3a: previously started experiment.
if 'block' in logs:

    ## Update metadata.
    session['workerId'] = info['workerId']
    session['ERROR'] = '1004: Suspected incognito user.'
    session['complete'] = 'error'
    write_metadata(session, ['ERROR','complete'], 'a')
```

This modification prevents NivTurk from kicking out a participant whose metadata file already contains the "experiment" event log, which is automatically written when a participant reaches the experiment page. Instead, the code above would kick out a participant whose metadata file contains the keyword "block", which might instead be written to a metadata file via [message passing](/nivturk/docs/cookbook/message-pass).

Second, two small changes need to be made in `/app/experiment.py`. First, the keyword "experiment" needs to be replaced in [line 28](https://github.com/nivlab/nivturk/blob/prolific/app/experiment.py#L28) as above. To continue the example, the keyword may again be replaced by the word "block":

```python
## Case 2: repeat visit.
elif 'block' in session:

    ## Update participant metadata.
    session['ERROR'] = "1004: Revisited experiment."
    session['complete'] = 'error'
    write_metadata(session, ['ERROR','complete'], 'a')
```

As above, this modification prevents NivTurk from kicking out a participant whose session contains the "experiment" entry -- which is automatically written when a participant reaches the experiment page -- and instead kicks out a participant whose session contains the keyword "block".

Finally, some additional code should be inserted to the `pass_message()` function in `/app/experiment.py` that inserts a new entry into a participant's session object when a particular message is received via [message passing](/nivturk/docs/cookbook/message-pass). To finish the example from above, the code below inserts a "block" entry into the participant's session when a message is received containing the keyword "block":

```python
def pass_message():
"""Write jsPsych message to metadata."""

if request.is_json:

    ## Retrieve jsPsych data.
    msg = request.get_json()

    ## Update participant metadata.
    session['MESSAGE'] = msg
    write_metadata(session, ['MESSAGE'], 'a')

    ## Update status of progress.
    if 'block' in msg:
        session['block'] = True
```

These three changes would make it such that a participant would be allowed to restart the experiment up until they reached the stage of an experiment that triggers a [message passing](/nivturk/docs/cookbook/message-pass) involving the word "block" (e.g. reaching the first block of an experiment).
