;window.Plautocompleter.Playlist = (function($) {

  var el;
  var template;

  /* Public methods */

  var initialize = function(elParam) {
    el = elParam;
    template = Handlebars.compile($("#playlist-template").html());
  };

  var generatePlaylist = function(playlist) {
    generatePlaylistFromApi(playlist, function(tracks) {
      el.html(template(tracks));
      window.Plautocompleter.Main.showView('playlist');
    });
  };

  /* Private methods */

  var generatePlaylistFromApi = function(playlist, onSuccess) {
    window.Plautocompleter.Playlists.fetchTracks(playlist, function(tracks) {

      console.log(tracks);

      onSuccess(tracks);
    });
  };

  /* Export public interface */

  return {
    initialize: initialize,
    generatePlaylist: generatePlaylist
  };

})(jQuery);
