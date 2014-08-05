from __future__ import print_function
import ConfigParser
import os

import httplib
import urllib
import json
from pprint import pprint

class EchoNestException(Exception): pass

class UnknownTrackException(EchoNestException): pass

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
            "bucket": "id:spotify",
            "limit": "true",
            "type": "song-radio"
        },
        doseq=True)

    conn = httplib.HTTPConnection(SERVER)
    conn.request("GET", PATH + "?" + params)
    data = conn.getresponse().read()

    response = json.loads(data)

    # TODO: catch keyerror
    if response["response"]["status"]["code"] == 0:
        result = []
        for song in response['response']['songs']:
            try:
                spotify_id = [i['foreign_id'] for i in song['artist_foreign_ids']
                              if i['catalog'] == 'spotify'][0]
                result.append({
                    'id': spotify_id,
                    'artist_name': song['artist_name'],
                    'title': song['title']
                })
            except KeyError:
                pass
        return result
    elif response["response"]["status"]["code"] == 5:
        raise UnknownTrackException("Unknown tracks {}".format(songs))
    else:
        raise EchoNestException("Invalid request {}".format(response["response"]["status"]))

if __name__ == "__main__":
    taylorswift = "spotify:track:26eccs3bbw6DMekFwZbdL2"
    metalguys = "spotify:track:26z9aeOfJ8FygiAivjDSr1"
    spice = "spotify:track:1Je1IMUlBXcx1Fz0WE7oPT"
    brassens = "spotify:track:5nuTwIhmN6AzktesqJh6p7"
    punk = "spotify:track:0Z4AhW3uUuuHPi1eZ6F3Ms"
    songs = generate_songs([spice, brassens, punk, taylorswift], 100)
    for song in songs:
        print("{} - {}".format(song['artist_name'].encode('utf-8'), song['title'].encode('utf-8')))