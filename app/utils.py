import random, string, socket, struct

def ip2long(ip):
    """Convert an IP string to int."""
    packedIP = socket.inet_aton(ip)
    return int(struct.unpack("!L", packedIP)[0])

def gen_code(N):
    """Generate random completion code."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=N))

def compute_bonus():
    return random.uniform(1, 10)
