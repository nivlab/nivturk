# NivTurk

Niv lab tools for securely serving and storing data from online computational psychiatry experiments.

## Quickstart

The following is the minimal set of commands needed to get started with NivTurk (assuming you have already a virtual machine with python 3.6+ installed):

```
  ssh <user-name>@<server-name>.princeton.edu
  git clone https://github.com/nivlab/nivturk.git
  cd nivturk
  pip install -r requirements.txt
  gunicorn -b 0.0.0.0:9000 -w 4 app:app
```

## Wiki

For details on how to serve your experiment, how the code is organized, and how data is stored, please see the [Wiki](https://github.com/nivlab/nivturk/wiki).
