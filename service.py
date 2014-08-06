import json
import functools
import logging
from os import path

from flask import Flask, request, url_for, redirect

import echonest
from decorators import crossdomain, nocache

app = Flask(__name__)

@app.route("/")
def index():
    return redirect(url_for('static', filename="index.html"))

@app.route("/generate_playlist", methods=['POST', 'OPTIONS'])
@app.route("/generate_playlist/<limit>", methods=['POST', 'OPTIONS'])
@app.route("/generate_playlist/<limit>/<pretty>", methods=['POST', 'OPTIONS'])
@crossdomain(origin='*', headers='Content-Type')
@nocache
def generate_playlist(limit=10, pretty=None):
    playlist = json.loads(request.get_data())
    logging.warning(playlist)
    limit = int(limit)

    if pretty == "pretty":
        formatter = functools.partial(
            json.dumps,
            sort_keys=True,
            indent=4,
            separators=(',', ': '))
    else:
        formatter = json.dumps

    try:
        result = echonest.generate_songs(playlist, limit)
    except echonest.EchoNestException as ex:
        return formatter({
            'status': {
                'success': False,
                'message': ex.message
            }})

    response = {
        'status': {
            'success': True,
            'message': 'Success'
        },
        'songs': result}

    return formatter(response)

def err(msg):
    return json.dumps({
        'status': {
            'success': False,
            'message': msg
        }})

@app.errorhandler(500)
def internal_error(error):
    return err("Unexpected error '{}'".format(error.message))

if __name__ == "__main__":
    app.run()
