import os

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

    ## Write metadata to disk.
    fout = os.path.join(session['metadata'], session['workerId'])
    with open(fout, mode) as f:
        for k in keys:
            f.write(f'{k}\t{session[k]}\n')

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
    fout = os.path.join(session['data'], '%s.json' %session['subId'])
    with open(fout, 'w') as f: f.write(json)
