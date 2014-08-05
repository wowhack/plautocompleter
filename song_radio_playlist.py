from __future__ import print_function
import ConfigParser
import os

import httplib
import urllib
import json
from pprint import pprint

def get_config():
    config = ConfigParser.ConfigParser()
    config.read('config.ini')

    if config.has_option('api', 'api_key'):
        api_key =  config.get('api', 'api_key')
    else:
        raise Exception('No api:api_key in config')

    return {'api_key': api_key}

SERVER = "developer.echonest.com"
PATH = "/api/v4/playlist/static"
config = get_config()

def generate_songs(songs, limit=10):
    """Take a list of song ids and generate a list of similar songs"""
    params = urllib.urlencode(
        {
            "api_key": config['api_key'],
            "song_id": songs,
            "format": "json",
            "results": limit,
            "type": "song-radio"
        },
        doseq=True)

    conn = httplib.HTTPConnection(SERVER)
    conn.request("GET", PATH + "?" + params)
    data = conn.getresponse().read()

    response = json.loads(data)

    # TODO: catch keyerror
    if response["response"]["status"]["code"] == 0:
        return response['response']['songs']
    else:
        raise Exception("Invalid request {}".format(response["response"]["status"]))

if __name__ == "__main__":
    pprint(generate_songs(["spotify:track:3L7BcXHCG8uT92viO6Tikl"], 42))

