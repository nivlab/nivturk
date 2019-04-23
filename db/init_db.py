import os, sqlite3

## Define root directory.
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Connect to database.
conn = sqlite3.connect(os.path.join(ROOT_DIR, 'workers.db'))

## Initialize cursor.
c = conn.cursor()

## Create table.
c.execute("""CREATE TABLE workers (
             workerId text,
             assignmentId text,
             hitId text,
             ipAddress int,
             complete int,
             bonus real)""")

## Commit table and close.
conn.commit()
conn.close()
