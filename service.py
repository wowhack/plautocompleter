import functools
import logging
from os import path

from flask import Flask, request, url_for, redirect, jsonify, json

import echonest

app = Flask(__name__)

@app.route("/")
def index():
    return redirect(url_for('static', filename="index.html"))

@app.route("/generate_playlist", methods=['POST', 'OPTIONS'])
@app.route("/generate_playlist/<int:limit>", methods=['POST', 'OPTIONS'])
def generate_playlist(limit=10):
    playlist = json.loads(request.get_data())

    try:
        result = echonest.generate_songs(playlist, limit)
    except echonest.EchoNestException as ex:
        return err(ex.message)

    return jsonify(status={'success': True, 'message': 'Success'},
                   songs=result)

def err(msg):
    return jsonify(status= {
        'success': False,
        'message': msg
    })

@app.after_request
def add_header(response):

    # These headers should be enough to disable caching across browsers
    # according to http://stackoverflow.com/a/2068407/98057
    response.headers['Pragma'] = 'no-cache' # HTTP 1.0
    response.headers['Expires'] = '0' # Proxies
    # HTTP 1.1
    response.cache_control.no_cache = True
    response.cache_control.no_store = True
    response.cache_control.must_revalidate = True
    response.cache_control.proxy_revalidate = True

    # Cross domain requests
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Max-Age'] = '0'

    return response

@app.errorhandler(500)
def internal_error(error):
    return err("Unexpected error '{}'".format(error.message))

if __name__ == "__main__":
    app.run()
