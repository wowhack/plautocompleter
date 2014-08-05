# http://developer.echonest.com/api/v4/playlist/static?api_key=HEBP8NCWOZVUXXPYV&song_id=spotify:track:3L7BcXHCG8uT92viO6Tikl&format=xml&results=100&type=song-radio

import json
import pprint

data = """{"response": {"status": {"version": "4.2", "code": 0, "message": "Success"}, "songs": [{"artist_id": "ARH6W4X1187B99274F", "id": "SONTJAC131677143B0", "artist_name": "Radiohead", "title": "A Wolf At The Door"}]}}"""
songs = json.loads(data)

if songs["response"]["status"]["code"] == 0:
	pprint.pprint(songs)
else:
	print "Invalid request " + str(songs["response"]["status"])