from __future__ import print_function
import ConfigParser
import os
import random
import httplib
import urllib
import json
from pprint import pprint
import logging

MAX_REQUESTS = 3

ECHONEST_SUCCESS = 0

ECHONEST_STATUS = {
    -1: "Unknown Error",
    0: "Success",
    1: "Missing/ Invalid API Key",
    2: "This API key is not allowed to call this method",
    3: "Rate Limit Exceeded",
    4: "Missing Parameter",
    5: "Invalid Parameter"
}

class EchoNestException(Exception): pass

class UnknownTrackException(EchoNestException): pass

ENV_API = 'ECHONEST_API_KEY'

def get_config():
    api_key = os.environ.get(ENV_API)

    if not api_key:
        raise Exception('No {} in environment'.format(ENV_API))

    return {'api_key': api_key}

SERVER = "developer.echonest.com"
PATH = "/api/v4/playlist/static"
config = get_config()

def generate_songs(playlist, limit=10):
    """Take a playlist and generate a list of similar songs"""

    result = []
    duplicate_ratio_guess = .2

    songs = [item['uri'] for item in playlist['tracks']]
    random.shuffle(songs)
    songs = songs[:5]

    unique_tracks = set([(item['artist'], item['name'])
                        for item in playlist['tracks']])

    conn = httplib.HTTPConnection(SERVER)
    requests = 0

    # keep requesting more until we reach the limit
    while len(result) < limit and requests < MAX_REQUESTS:
        requests += 1

        params = urllib.urlencode(
            {
                "api_key": config['api_key'],
                "song_id": songs,
                "format": "json",
                "results": min(100, int(round(limit + limit*duplicate_ratio_guess))),
                "bucket": ["tracks", "id:spotify"],
                "limit": "true",
                "type": "song-radio"
            },
            doseq=True)


        conn.request("GET", PATH + "?" + params)
        data = conn.getresponse().read()

        response = json.loads(data)

        if response["response"]["status"]["code"] == ECHONEST_SUCCESS:
            for song in response['response']['songs']:
                try:
                    track_info = song['tracks'][0]
                    spotify_id = track_info['foreign_id']
                    song_info = (song['artist_name'], song['title'])
                    if song_info not in unique_tracks:
                        result.append({
                            'id': spotify_id,
                            'artist_name': song['artist_name'],
                            'title': song['title']
                        })
                        unique_tracks.add(song_info)
                except KeyError:
                    pass
        else:
            status = response["response"]["status"]
            message = status["message"]
            code = status["code"]
            code_type = ECHONEST_STATUS[code]
            err_message = "EchoNest API Error #{} ({}): {}".format(code, code_type, message)
            logging.error(err_message)
            raise EchoNestException(err_message)

    return result[:limit]


if __name__ == "__main__":
    taylorswift = "spotify:track:26eccs3bbw6DMekFwZbdL2"
    deathmetal = "spotify:track:26z9aeOfJ8FygiAivjDSr1"
    spicegirls = "spotify:track:1Je1IMUlBXcx1Fz0WE7oPT"
    brassens = "spotify:track:5nuTwIhmN6AzktesqJh6p7"
    punk = "spotify:track:34uKquOrQLgzBsUbFTkMTc"
    indie1 = "spotify:track:3CsMdAuNoD7e8kRzHV24TR"
    indie2 = "spotify:track:69kOkLUCkxIZYexIgSG8rq" 
    indie3 = "spotify:track:3AA8xNhDC0MpqwkGX3EP5V"
    emo = "spotify:track:1MX16fYlJ4HydXV9icjWfp"
    songs = generate_songs([indie2,taylorswift,indie3], 100)
    for song in songs:
        print("{} - {}".format(song['artist_name'].encode('utf-8'), song['title'].encode('utf-8')))
