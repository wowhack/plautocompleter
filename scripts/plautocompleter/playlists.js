;window.Plautocompleter.Playlists = (function($) {

  var el;
  var template;

  /* Public methods */

  var initialize = function(elParam) {
    el = elParam;
    template = Handlebars.compile($("#playlists-template").html());
  };

  var fetch = function() {
    fetchFromSpotify(function(data) {
      var playlist = removeNotCurrentUsersPlaylists(data.items);
      el.html(template(playlist));
    });
  };

  var fetchTracks = function(playlist, onSuccess) {
    fetchTracksFromSpotify(playlist, function(data){
      var playlistItems = data.tracks.items;
      var tracks = $.map(playlistItems, function(obj) {
        return obj.track;
      });

      onSuccess(tracks);
    });
  };

  /* Private methods */

  var fetchFromSpotify = function(onSuccess) {
    var accessToken = window.Plautocompleter.Login.getToken();
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response) {
        window.Plautocompleter.Login.userId = response.id.toLowerCase();
        $.ajax({
          url: 'https://api.spotify.com/v1/users/' + window.Plautocompleter.Login.userId + '/playlists',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          success: function(response) {
            onSuccess(response);
          }
        });
      }
    });
  };

  var fetchTracksFromSpotify = function(playlistUri, onSuccess) {
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

  var removeNotCurrentUsersPlaylists = function(playlist){
    return $.grep(playlist, function(value) {
      return value.owner.id == window.Plautocompleter.Login.userId;
    });
  };

  /* Export public interface */

  return {
    initialize: initialize,
    fetch: fetch,
    fetchTracks: fetchTracks
  };

})(jQuery);
