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
- Run using foreman: foreman run
