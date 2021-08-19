---
layout: default
title: Longitudinal data
parent: Cookbook
nav_order: 5
---

## Longitudinal data

By default, NivTurk assigns new anonymized subject IDs to participants when they first access an experiment. In the context of longitudinal data collection, this is obviously undesirable. It is very easy, however, to extend NivTurk to allow for consistent mapping of worker IDs to subject IDs.

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
