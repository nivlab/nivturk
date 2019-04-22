import random, string

def gen_code(N):
    """Generate random completion code."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=N))

def compute_bonus():
    return random.uniform(1, 10)
