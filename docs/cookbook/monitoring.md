---
layout: default
title: Monitoring subjects
parent: Cookbook
nav_order: 2
---

# Monitoring subjects

While an experiment is live, you may want to monitor how many participants have reached each stage of an experiment (e.g. instructions, task blocks, surveys, etc.).

Below is an example of a bash script that can be run in the parent folder of a NivTurk experiment to monitor participants' progress. Specifically, the program searches the files in `/metadata` for particular event logs and reports the number of matches.

```bash
while true
do

  ## Clear screen
  clear        

  ## Print current data/time
  date         

  ## Monitor participants
  echo "experiment:" $(grep -iP -m 1 "experiment" metadata/[0-9]** | wc -l)
  echo "instructions:" $(grep -iP -m 1 "instructions" metadata/[0-9]** | wc -l)
  echo "block 1:" $(grep -iP -m 1 "block 1" metadata/[0-9]** | wc -l)
  echo "block 2:" $(grep -iP -m 1 "block 2" metadata/[0-9]** | wc -l)
  echo "complete" $(grep -iP -m 1 "code_success" metadata/[0-9]** | wc -l)
  echo "data" $(find data -maxdepth 1 -type f -name "**.json" | wc -l)
  echo "reject" $(find reject -maxdepth 1 -type f -name "**.json" | wc -l)
  echo "error" $(grep -iP -m 1 "error" metadata/[0-9]** | wc -l)

  ## Pause for 30 seconds
  sleep 30

done
```

For example, the script above first checks for the number of participants who have reached the experiment page, then the number of participants who have reached the instructions, then block 1, and so on. (Note: by default, NivTurk only reports when a participant has reached the experiment and complete pages. To add custom events to the log file, please see [message passing](/nivturk/docs/cookbook/message-pass).)

The code above also prints out the number of files in the `/data` and `/reject`, which shows the number of participants who have successfully completed the experiment and were rejected from the experiment, respectively.

Because the script just implements a while loop, the `sleep` function makes sure each loop is executed only once every 30 seconds (this can be adjusted as desired).

Finally, the script can be executed with the following:

```
source <script_name>.sh
```

where `<script-name>.sh` is a stand-in for file that contains the code above.
