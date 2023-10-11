from flask import Flask, request

app = Flask(__name__)

@app.route('/<int:status_code>')
def bad_request(status_code):
    return f'{status_code}_error', status_code

app.run(host='0.0.0.0', port=80)
