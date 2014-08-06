import httplib
import urllib
import json
import logging

SERVER = "api.spotify.com"
PATH = "/v1/artists"

def generate_images(songs):
    conn = httplib.HTTPSConnection(SERVER)
    ids = ",".join([item['id'] for item in songs])

    params = urllib.urlencode(
    {
        "ids": ids
    })

    conn.request("GET", PATH + "?" + params)
    data = conn.getresponse().read()
    logging.warning(data)

    response = json.loads(data)
    if 'artists' not in response:
        return []

    artists = filter(lambda artist: 'images' in artist, response['artists'])
    return [artist['images'][-1] for artist in artists]