jQuery(function($) {

  // Initialize stuff
  window.Plautocompleter.Playlists.initialize($("#playlists"));

  // Check if token exists
  if(window.Plautocompleter.Login.getToken() == undefined) {
    $('#app-login').show();
    $('#app-playlists').hide();
  } else {
    $('#app-login').hide();
    $('#app-playlists').show();
    window.Plautocompleter.Playlists.fetch();
  }

  $('#login').on('click', function() {
    window.Plautocompleter.Login.login();
  });

});
