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

    fetchFromSpotify(playlistUri, function(data){
      result.id = data.id;
      result.name = data.name;
      result.tracks = $.map(data.tracks.items, function(obj) {
        return obj.track;
      });

      onSuccess(result);
    });
  };

  var generatePlaylist = function(playlist) {
    fetch(playlist, function(result) {
      el.html(template(result));
      window.Plautocompleter.Main.showView('playlist');
    });
  };

  var save = function(playlist) {
    var accessToken = window.Plautocompleter.Login.getToken();
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

  // var generatePlaylistFromApi = function(playlist, onSuccess) {


  //     onSuccess(tracks);
  //   });
  // };

  /* Export public interface */

  return {
    initialize: initialize,
    fetch: fetch,
    generatePlaylist: generatePlaylist,
    save: save
  };

})(jQuery);
