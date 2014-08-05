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
      el.html(template(data.items));
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
