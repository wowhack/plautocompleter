;window.Plautocompleter.Playlists = (function($) {

  var el;
  var template;

  /* Public methods */

  var initialize = function(elParam) {
    el = elParam;
    template = Handlebars.compile($("#playlists-template").html());
  };

  var fetch = function() {
    var data = {};
    fetchFromSpotify(function(response) {
      data.numberOfPlaylists = response.total;
      data.playlists = $.map(response.items, function(item) {
        return {
          name: item.name,
          href: item.href,
          numberOfTracks: item.tracks.total,
          isShort: (item.tracks.total < 5)
        };
      });
      el.html(template(data));
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
        var user_id = response.id.toLowerCase();
        $.ajax({
          url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
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

  /* Export public interface */

  return {
    initialize: initialize,
    fetch: fetch
  };

})(jQuery);
