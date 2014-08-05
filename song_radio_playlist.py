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

song_ids = ["spotify:track:3L7BcXHCG8uT92viO6Tikl"]

params = urllib.urlencode(
    {
        "api_key": config['api_key'],
        "song_id": song_ids,
        "format": "json",
        "results": "10",
        "type": "song-radio"
    },
    doseq=True)

conn = httplib.HTTPConnection(SERVER)
conn.request("GET", PATH + "?" + params)
data = conn.getresponse().read()

response = json.loads(data)

# TODO: catch keyerror
if response["response"]["status"]["code"] == 0:
    for song in response['response']['songs']:
        print("{} - {}".format(song['artist_name'], song['title']))
else:
    print("Invalid request {}".format(response["response"]["status"]))
