from flask import Flask

import echonest
import json
import functools
from decorators import crossdomain

app = Flask(__name__)

@app.route("/")
def index():
    return err("Nothing to see here")

@app.route("/generate_playlist/<songs>")
@app.route("/generate_playlist/<songs>/<limit>")
@app.route("/generate_playlist/<songs>/<limit>/<pretty>")
@crossdomain(origin='*', max_age=0)
def generate_playlist(songs, limit=10, pretty=None):
    limit = int(limit)
    song_ids = songs.split(",")

    if pretty == "pretty":
        formatter = functools.partial(
            json.dumps,
            sort_keys=True,
            indent=4,
            separators=(',', ': '))
    else:
        formatter = json.dumps

    try:
        result = echonest.generate_songs(song_ids, limit)
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
def pageNotFound(error):
    return err("Unexpected error '{}'".format(error.message))

if __name__ == "__main__":
    app.run()
