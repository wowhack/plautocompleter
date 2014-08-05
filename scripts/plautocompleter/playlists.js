;window.Plautocompleter.Playlists = (function($) {

  var el;
  var template;

  /* Public methods */

  var initialize = function(elParam) {
    el = elParam;
    template = Handlebars.compile($("#playlists-template").html());
  };

  var fetch = function() {
    var data = json();
    el.html(template(data.items));
  };

  /* Private methods */

  var json = function() {
    return {
      "href" : "https://api.spotify.com/v1/users/jensljungblad/playlists",
      "items" : [ {
        "collaborative" : false,
        "external_urls" : {
          "spotify" : "http://open.spotify.com/user/jensljungblad/playlist/6WXJlLTpcv49AwPDMxosfw"
        },
        "href" : "https://api.spotify.com/v1/users/jensljungblad/playlists/6WXJlLTpcv49AwPDMxosfw",
        "id" : "6WXJlLTpcv49AwPDMxosfw",
        "name" : "Chill",
        "owner" : {
          "external_urls" : {
            "spotify" : "http://open.spotify.com/user/jensljungblad"
          },
          "href" : "https://api.spotify.com/v1/users/jensljungblad",
          "id" : "jensljungblad",
          "type" : "user",
          "uri" : "spotify:user:jensljungblad"
        },
        "public" : false,
        "tracks" : {
          "href" : "https://api.spotify.com/v1/users/jensljungblad/playlists/6WXJlLTpcv49AwPDMxosfw/tracks",
          "total" : 3
        },
        "type" : "playlist",
        "uri" : "spotify:user:jensljungblad:playlist:6WXJlLTpcv49AwPDMxosfw"
      }, {
        "collaborative" : false,
        "external_urls" : {
          "spotify" : "http://open.spotify.com/user/jensljungblad/playlist/0O0s4q0D3Jo8NWP8teZbfV"
        },
        "href" : "https://api.spotify.com/v1/users/jensljungblad/playlists/0O0s4q0D3Jo8NWP8teZbfV",
        "id" : "0O0s4q0D3Jo8NWP8teZbfV",
        "name" : "Dance",
        "owner" : {
          "external_urls" : {
            "spotify" : "http://open.spotify.com/user/jensljungblad"
          },
          "href" : "https://api.spotify.com/v1/users/jensljungblad",
          "id" : "jensljungblad",
          "type" : "user",
          "uri" : "spotify:user:jensljungblad"
        },
        "public" : false,
        "tracks" : {
          "href" : "https://api.spotify.com/v1/users/jensljungblad/playlists/0O0s4q0D3Jo8NWP8teZbfV/tracks",
          "total" : 5
        },
        "type" : "playlist",
        "uri" : "spotify:user:jensljungblad:playlist:0O0s4q0D3Jo8NWP8teZbfV"
      } ],
      "limit" : 2,
      "next" : null,
      "offset" : 0,
      "previous" : null,
      "total" : 2
    }
  };

  /* Export public interface */

  return {
    initialize: initialize,
    fetch: fetch
  };

})(jQuery);
