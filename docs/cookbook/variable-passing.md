---
layout: default
title: Variable passing
parent: Cookbook
nav_order: 6
---

# Variable passing

Even though NivTurk is written in python and jsPsych is written in JavaScript, it is possible to pass variables from the former to the latter using Flask. This may be useful, for example, if you want to assign certain participants to particular versions of an experiment (e.g. odd-numbered participants complete version 1 and even-numbered participants complete version 2).

Variables can be passed from NivTurk to jsPsych by modifying [line 46](https://github.com/nivlab/nivturk/blob/prolific/app/experiment.py#L46) of `/app/experiment.py`. As an example, the below passes a new variable, *version*, that might be defined elsewhere in the Flask application:

```python
## Case 3: first visit.
else:

    ## Update participant metadata.
    session['experiment'] = True
    write_metadata(session, ['experiment'], 'a')

    ## Present experiment.
    return render_template(
        'experiment.html',
         workerId=session['workerId'],
         assignmentId=session['assignmentId'],
         hitId=session['hitId'],
         code_success=session['code_success'],
         code_reject=session['code_reject'],
         version=session['version']
    )
```
[Note: the example above is specific to the Prolific branch. Please [see here](https://github.com/nivlab/nivturk/blob/mturk/app/experiment.py#L46) for the corresponding code for MTurk.]

To receive and make available the variable in jsPsych, some additional code needs to be added to the `<head>` section of `/app/templates/experiment.html`. To continue the example from above, the following code might be added to make the variable *version* available:

```js
<script type="text/javascript">
  {% raw %}var version = parseInt("{{version}}");    // Try to retrieve version number from Flask.{% endraw %}
  if (isNaN(version)) {version = -1;}       // If retrieval fails, set to -1.
</script>
```

In the above, the code attempts to retrieve *version*. If it fails to do so, it sets version to -1. The second line is not strictly necessary, but catches possible errors as they arise.
