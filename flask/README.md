## flask test traffic
```bash
#!/bin/bash
echo 'password' | passwd --stdin ec2-user
yum install -y python3-pip
pip3 install flask
cat << EOF > app.py
from flask import Flask, request

app = Flask(__name__)

@app.route('/<int:status_code>')
def bad_request(status_code):
    return f'{status_code}_error', status_code

app.run(host='0.0.0.0', port=80)
EOF
nohup python3 app.py &
cat << EOF > test.sh
for i in {1..504}
do
    curl --connect-timeout 1 -m 1 -# -o /dev/null -I -w %{http_code} -s -XGET http://127.0.0.1/$i
done
EOF
chmod +x test.sh
./test.sh
```
