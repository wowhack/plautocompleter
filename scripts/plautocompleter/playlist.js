;window.Plautocompleter.Playlist = (function($) {

  var el;
  var template;

  /* Public methods */

  var initialize = function(elParam) {
    el = elParam;
    template = Handlebars.compile($("#playlist-template").html());

    $('#app').on('click', '.destroy', function() {
      $(this).parents('li').remove();
    });
  };

  var fetch = function(playlistUri, onSuccess) {
    var result = {};

    fetchFromSpotify(playlistUri, function(data) {
      result.name = data.name;
      result.tracks = $.map(data.tracks.items, function(item) {
        return {
          artist: item.track.artists[0].name,
          name: item.track.name,
          uri: item.track.uri
        };
      });

      // Make some fetching from the intense scrubland
      var ids = $.map(result.tracks.slice(0, 1), function(item) {
        return item.uri;
      });

      fetchFromIntenseScrubland(ids, function(tracks) {
        result.tracks = result.tracks.concat(tracks);
        onSuccess(result);
      });
    });
  };

  var generatePlaylist = function(playlist) {
    fetch(playlist, function(result) {
      el.html(template(result));
      window.Plautocompleter.Main.showView('playlist');
    });
  };

  /* Private methods */

  var fetchFromSpotify = function(playlistUri, onSuccess) {
    var accessToken = window.Plautocompleter.Login.getToken();
    $.ajax({
      url: playlistUri,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response) {
        onSuccess(response);
      }
    });
  };

  var fetchFromIntenseScrubland = function(tracks, onSuccess) {
    $.ajax({
      url: 'http://intense-scrubland-2743.herokuapp.com/generate_playlist/' + tracks.join(',') + '/10',
      success: function(response) {
        response = JSON.parse(response);
        onSuccess($.map(response.songs, function(item) {
          return {
            artist: item.artist_name,
            name: item.title,
            uri: item.id
          };
        }));
      }
    });
  };

  /* Export public interface */

  return {
    initialize: initialize,
    fetch: fetch,
    generatePlaylist: generatePlaylist
  };

})(jQuery);
