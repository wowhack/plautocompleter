/*
- fix playlists template so it shows length
- fix playlists template with correct copy
*/

jQuery(function($) {

  window.Plautocompleter.Main = (function($) {

    /* Public methods */

    var initialize = function() {

      window.Plautocompleter.Login.initialize();
      window.Plautocompleter.Playlists.initialize($("#playlists"));
      window.Plautocompleter.Playlist.initialize($("#app-playlist"));

      if (window.Plautocompleter.Login.getToken() == undefined) {
        showView('login');
      } else {
        showView('playlists');
        window.Plautocompleter.Playlists.fetch();
      }



      window.Plautocompleter.Playlist.generatePlaylist();

    };

    var showView = function(view) {
      $('#app-login').hide();
      $('#app-playlists').hide();
      $('#app-playlist').hide();
      if (view == 'login') {
        $('#app-login').show();
      } else if (view == 'playlists') {
        $('#app-playlists').show();
      } else if (view == 'playlist') {
        $('#app-playlist').show();
      };
    };

    /* Export public interface */

    return {
      initialize: initialize,
      showView: showView
    };

  })(jQuery);

  // Everything ready to go
  window.Plautocompleter.Main.initialize();

});
