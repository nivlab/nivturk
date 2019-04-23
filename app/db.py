import sqlite3

def db_connect(fn):
    """Open database connection."""
    conn = sqlite3.connect(fn)    # Connect to database.
    c = conn.cursor()             # Establish cursor.
    return conn, c

def db_close(conn):
    """Close database connection."""
    conn.commit(); conn.close()

def db_check(db, workerId, debug=False):
    """Check if worker ID in database."""

    ## Debug mode: override check.
    if debug:

        return False

    ## Error-catching: missing worker ID.
    elif workerId is None:

        return True

    else:

        ## Connect to dabase.
        conn, c = db_connect(db)

        ## Execute command.
        c.execute("SELECT * FROM workers WHERE workerId='%s'" %str(workerId))

        ## Find matching rows.
        rows = c.fetchall()

        ## Commit and close.
        db_close(conn)

        ## Determine if any matches.
        return any(rows)

def db_insert(db, workerId, assignmentId, hitId, ipAddress, complete=0, bonus=0):
    """Insert new row into database."""

    ## Connect to dabase.
    conn, c = db_connect(db)

    ## Define command.
    cmd = "INSERT INTO workers VALUES (:workerId, :assignmentId, :hitId, :ipAddress, :complete, :bonus)"

    ## Define values.
    values = dict(workerId=str(workerId), assignmentId=str(assignmentId),
                  hitId=str(hitId), ipAddress=int(ipAddress),
                  complete=float(complete), bonus=float(bonus))

    ## Execute command.
    c.execute(cmd, values)

    ## Commit and close.
    db_close(conn)

def db_update(db, workerId, bonus=0):

    ## Connect to dabase.
    conn, c = db_connect(db)

    ## Define command.
    cmd = "UPDATE workers SET complete=1, bonus=:bonus WHERE workerId=:workerId"

    ## Define values.
    values = dict(workerId=str(workerId), bonus=float(bonus))

    ## Execute command.
    c.execute(cmd, values)

    ## Commit and close.
    db_close(conn)
