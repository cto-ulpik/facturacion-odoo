import base64
import hashlib
import json
import pytz
import random
import string
from datetime import datetime
def get_auth_dict(login, secretKey):
# Create nonce
nonce_characters = string.ascii_letters + string.digits
nonce = ''.join([random.choice(nonce_characters) for index in range(16)])
nonce_b64 = base64.b64encode(nonce)
# Create seed
seed = pytz.UTC.localize(datetime.utcnow()).isoformat()
# Create trankey
trankey = hashlib.sha256(nonce + seed + secretKey).digest()
trankey_b64 = base64.b64encode(trankey)
# Return auth object
return {
'login': login,
'nonce': nonce_b64,
'seed': seed,
'trankey': trankey_b64,
}
login = 'usuario1@email.com'
secretKey = 'aaaAAAbbbBBB111'
json.dumps(get_auth_dict(login=login, secretKey=secretKey))