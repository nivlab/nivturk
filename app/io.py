import os
from pandas import read_json

def save_anon_data(json, task, data_dir):
    """Save behavior data to disk.

    Parameters
    ----------
    json : object
        Data object returned by jsPsych.
    task : str
        Name of activity performed by the participant.
    data_dir : str
        Path to data directory.

    Notes
    -----
    Data always saved to new participant folder.
    """

    ## Error-catching.
    if not os.path.isdir(data_dir):
        os.makedirs(data_dir)

    ## Convert JSON to Pandas DataFrame.
    df = read_json(json)

    ## Determine subject number.
    n_sub = len(os.listdir(data_dir))
    subno = n_sub + 1

    ## Make subject folder.
    sub_dir = os.path.join(data_dir, 'sub-%0.5d' %subno)
    os.makedirs(sub_dir)

    ## Save data.
    f = os.path.join(sub_dir, 'sub-%0.5d_task-%s_beh.csv' %(subno,task))
    df.to_csv(f, index=False)
