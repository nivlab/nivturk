import os
from datetime import datetime

def write_metadata(session, keys, mode='w'):
    """Write metadata to disk.

    Parameters
    ----------
    session : flask session
        Current user session.
    keys : list
        Session keys to write to file.
    mode : r | w | a
        Open file mode.
    """

    ## Define timestamp.
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    ## Write metadata to disk.
    fout = os.path.join(session['metadata'], session['workerId'])
    with open(fout, mode) as f:
        for k in keys:
            f.write(f'{timestamp}\t{k}\t{session[k]}\n')

def write_data(session, json):
    """Write jsPsych output to disk.

    Parameters
    ----------
    session : flask session
        Current user session.
    json : object
        Data object returned by jsPsych.
    """

    ## Write data to disk.
    fout = os.path.join(session['data'], '%s_%s.json' % (session['subId'], session['expt_start_time']) )
    with open(fout, 'w') as f: f.write(json)
