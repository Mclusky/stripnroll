const $ = require('jquery');

// *******Setting Audio source ****** //
function playSong(e) {
  e.preventDefault();
  const lp = $('.preview .active').attr('id');
  const player = document.querySelector('#mp3-player');
  // ******Set the audio source to the song's title******** //
  const song = this
    .dataset.title
    .replace(/[ ]/g, '-');
  $('#mp3-player source').attr('src', `assets/music/${lp}/${song}.mp3`);
  // ***************************************************** //
  // Setting all other buttons display back to normal//
  $('button.play')
    .removeClass('btn-hide')
    .addClass('btn-active');
  $('button.pause')
    .removeClass('btn-active')
    .addClass('btn-hide');
  // Loading/Playing songs or Pausing and hiding/showing play/pause button//
  if ($(this).hasClass('play')) {
    $(player).addClass('track-playing');
    $(player).removeClass('track-paused');
    player.pause();
    player.load();
    player.oncanplaythrough = () => {
      if ($(player).hasClass('track-playing')) {
        player.play();
        const min = Math.floor(player.duration / 60);
        const secs = Math.floor(player.duration % 60);
        $('span.song-playing')
          .empty()
          .append(this.dataset.title);
        $('span.duration')
          .empty()
          .append(`${min}: ${secs < 10 ? 0 : ''}${secs}`);
      }
    };
    $(this).toggleClass('btn-active btn-hide');
    $(this)
      .siblings('.pause')
      .toggleClass('btn-active btn-hide');
  } else if ($(this).hasClass('pause')) {
    $(player).addClass('track-paused');
    $(player).removeClass('track-playing');
    player.pause();
  }
}

function populate(data) {
  const details = $('#music-template .band-credits');
  const audio = $('#audio-container');
  const list = $('.preview .active').attr('id');
  const lp = data.records[list];
  const { title, year } = lp;
  const studio = $(`<p itemprop='recordedAt'>${lp.description.studio}</p>`);
  const credits = $(`<p itemprop='byArtist'>${lp.description.credits}</p>`);
  const featuring = $(`<p>${lp.personel.featuring}</p>`) || '';
  const tracks = $('ol.songs');
  // ********Adding album details to the page********* //
  $(details).empty();
  $(tracks).empty();
  $('#lp-title').html(title);
  $('#lp-year').html(year);
  $(details).append([studio, credits]);
  if (lp.personel.featuring !== undefined) {
    $(details).append(featuring);
  }
  const members = [];
  $.each((lp.personel.names), (name, desc) => {
    members.push((`<span class="member-name">${name}</span> : ${desc}`));
  });
  $.each(members, (i, mem) => {
    $(`<p>${mem}</p>`).appendTo(details);
  });
  const songs = [];
  $.each((lp.trackListing), (i, track) => {
    songs.push(track);
  });
  $.each(songs, (i, song) => {
    $(`<li>
        <span class="song-name" itemprop="track">
        ${i + 1}. ${song}
        </span>
        <div class="icon-container">
          <button class="control play btn-active" data-title="${song}">
            <i class="fas fa-play"></i>
          </button>
          <button class="control pause btn-hide" data-title="${song}">
            <i class="fas fa-pause"></i>
          </button>
        </div>`)
      .appendTo(tracks);
  });
  $(tracks).appendTo(audio);
  $('button.control').on('click', playSong);
}
// ***Fetching info from server with AJAX*** //
function getAlbumInfo() {
  const dataURL = 'assets/json/records.json';
  $.getJSON(dataURL, data => populate(data));
}

function changeLpCover() {
  $('.preview li').removeClass('active');
  $(this).addClass('active');
  const newSource = $(this).find('source').clone();
  const newImg = $(this).find('img').clone();
  $('#lp-active').find('source').remove();
  $('#lp-active img').replaceWith(newImg);
  $('#lp-active').prepend(newSource);
}

$(window).on('load', getAlbumInfo);
$('.preview li').on('click', changeLpCover);
$('.preview li').on('click', getAlbumInfo);
