---
layout: default
title: Longitudinal data
parent: Cookbook
nav_order: 5
---

# Longitudinal data

By default, NivTurk assigns new anonymized subject IDs to participants when they first access an experiment. In the context of longitudinal data collection, this is obviously undesirable - as ideally there would be continuity in subject IDs for easier data analysis. It is very easy, however, to extend NivTurk to allow for consistent mapping of worker IDs to subject IDs.

One simple solution is to modify `/app/__init__.py` to read in a comma-separated text file of worker ID - subject ID pairings, like so:

```python
## Check Flask password.
secret_key = cfg['FLASK']['SECRET_KEY']
if secret_key == "PLEASE_CHANGE_THIS":
    warnings.warn("WARNING: Flask password is currently default. This should be changed prior to production.")

## CUSTOM: Load mapping.
mapping = dict()
with open(os.path.join(ROOT_DIR, 'mapping'), 'r') as f:
    for line in f.readlines():
        k, v = line.strip().split(',')
        mapping[k] = v

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = secret_key
```

Then, inside of `index()`, one can check to see if the current worker ID matches that from a previous session:

```python
## Record incoming metadata.
info = dict(
    workerId     = request.args.get('workerId'),        # MTurk metadata
    assignmentId = request.args.get('assignmentId'),    # MTurk metadata
    ...
)

## Define subject id.
info['subId'] = mapping.get(info['workerId'], gen_code(24))
```

The final line above checks `mapping` -- a lookup dictionary of worker IDs and subject IDs -- for the current subject's worker ID. If it exists in the dictionary, the previous subject ID is returned. Otherwise, a new anonymized subject ID is generated.

Another problem that may arise when using NivTurk for longitudinal studies is that having the same participant access the experiment twice can result in their workerId to be flagged as having already visited/completed the experiment and be automatically redirected to the end of the experiment (i.e. kicked out of the study). This is because, as mentioned above, NivTurk was set up by default to be for cross-sectional studies.

To by-pass this potential issue, each study session needs to be a separate folder, so that the metadata is kept separate from session to session.  
  
For example, you might have:  
| -- project_folder  
|     |--- session_1  
|            |--- app  
|            |--- data  
|            |--- metadata  
|     |--- session_2    
|            |--- app  
|            |--- data  
|            |--- metadata  
  
  

