;window.Plautocompleter.Login = (function($) {

  var originUri = 'http://localhost:8000/';
  var accessToken;

  var login = function(){

    var params = {
        client_id: '1dfce943394b4650ba94e907d2856008',
        redirect_uri: originUri,
        scope: 'user-read-private playlist-read-private',
        response_type: 'token'
    };

    // redirect to login page.
    window.location = "https://accounts.spotify.com/authorize?" + toQueryString(params);
  }

  function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
  }

  var getToken = function() {
    if(accessToken != undefined) {
      return  accessToken;
    }

    accessToken = window.location.hash.substring(1).split('&')[0].split('=')[1];
    return accessToken;
  }

  /* Export public interface */

  return {
    login: login,
    getToken: getToken
  };

})(jQuery);
