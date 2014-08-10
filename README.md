plautocompleter
===============

Playlist autocompletion

Start the web service
---------------------

- Install the heroku toolbelt: https://toolbelt.heroku.com/
- Create a virutalenv: virtualenv -p $(which python2) env
- Activate: source env/bin/activate
- Install the requirements: pip install -r requirements.txt
- Set the EchoNest API key in your env: export ECHONEST_API_KEY=***
- Run using foreman: foreman start


TODO
----

### Write some tests

The input to the playlist generator is a playlist, on this format:

```javascript
{
    "id": "2GrYmVOZTjto09GzcEEqLP",
    "name": "Sandras",
    "tracks": [
        {
            "artist": "Spice Girls",
            "name": "Wannabe - Radio Edit",
            "uri": "spotify:track:1Je1IMUlBXcx1Fz0WE7oPT",
            "original": true
        },
        {
            "artist": "Iron Maiden",
            "name": "Run to the Hills - 1998 - Remaster",
            "uri": "spotify:track:4Z4ZLBzCXSlHSCaxZ3WS7p",
            "original": true
        },
        {
            "artist": "Björk",
            "name": "Army of Me",
            "uri": "spotify:track:0pXQWCgKlh9ZiXcIE6wwC4",
            "original": true
        }
    ]
}
```
