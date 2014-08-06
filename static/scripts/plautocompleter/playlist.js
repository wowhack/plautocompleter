;window.Plautocompleter.Playlist = (function($) {

  var el;
  var template;
  var audioObject = null;


  /* Public methods */

  var initialize = function(elParam) {
    el = elParam;
    template = Handlebars.compile($("#playlist-template").html());

    $('#app').on('click', '.destroy', function() {
      $(this).parents('li').remove();
    });

    $('#app').on('click', '.preview', function(e) {
      e.preventDefault();
      $this = $(this);
      if ($this.hasClass('stopped')) {
        $this.removeClass('stopped').addClass('playing');
        playTrack($this.parents('li').data('track-uri'));
      } else {
        $this.removeClass('playing').addClass('stopped');
        stopTrack();
      }
    });

    $('#app').on('click', '#save', function() {
      var $playlist = $('#playlist');
      var playlistId = $playlist.data('playlist-id');
      var playlistTracks = $.map($playlist.children(), function(item) {
        return $(item).data('track-uri');
      });

      save(playlistId, playlistTracks);
    });

    $('#app').on('click', '#back', function() {
      window.Plautocompleter.Main.showView('playlists');
    });
  };

  var fetch = function(playlistUri, onSuccess) {
    var result = {};

    fetchFromSpotify(playlistUri, function(data) {
      result.id = data.id;
      result.name = data.name;
      result.tracks = $.map(data.tracks.items, function(item) {
        return {
          artist: item.track.artists[0].name,
          name: item.track.name,
          uri: item.track.uri,
          original: true
        };
      });

      fetchFromIntenseScrubland(result, function(tracks) {
        result.tracks = result.tracks.concat(tracks);
        onSuccess(result);
      });
    });
  };

  var generatePlaylist = function(playlist) {
    fetch(playlist, function(result) {
      el.html(template(result));
      window.Plautocompleter.Main.showView('playlist');

      $('ol li.original').last().next().addClass('last-original');
    });
  };

  var save = function(playlistId, playlistTracks) {
    var accessToken = window.Plautocompleter.Login.getToken();

    $.ajax({
      url: 'https://api.spotify.com/v1/users/' + window.Plautocompleter.Login.userId
        + '/playlists/' + playlistId
        + '/tracks?uris=' + playlistTracks.toString(),
      type: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response) {
        window.Plautocompleter.Main.showView('playlists');
      }
    });
  };

  var playTrack = function(trackUrl) {
    // get the preview track from spotify
    var id = trackUrl.split(':')[2];
    var accessToken = window.Plautocompleter.Login.getToken();
    $.ajax({
      url: 'https://api.spotify.com/v1/tracks/' + id,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response) {
        audioObject = new Audio(response.preview_url);
        audioObject.play();
      }
    });

  };

  var stopTrack = function() {
    audioObject.pause();
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

  var fetchFromIntenseScrubland = function(playlist, onSuccess) {
    $.ajax({
      url: 'http://plautocompleter.herokuapp.com/generate_playlist/10',
      type: 'POST',
      data: JSON.stringify(playlist),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response) {
        onSuccess($.map(response.songs, function(item) {
          return {
            artist: item.artist_name,
            name: item.title,
            uri: item.id,
            original: false
          };
        }));
      }
    });
  };

  /* Export public interface */

  return {
    initialize: initialize,
    fetch: fetch,
    generatePlaylist: generatePlaylist,
    save: save
  };

})(jQuery);
