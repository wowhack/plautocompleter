jQuery(function($) {

  // Check if token exists
  var token = window.Plautocompleter.Login.getToken();

  if(token == undefined) {
    //show logedin view.
    $('#app-login').show();
    $('#app-playlists').hide();
  }
  else {
    $('#app-login').hide();
    $('#app-playlists').show();
  }

  document.getElementById('login-btn').addEventListener('click', function() {
       window.Plautocompleter.Login.login();
  });
});
