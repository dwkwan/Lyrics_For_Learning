// Adds event listener for navigation back to homepage
document.addEventListener('DOMContentLoaded', function (event) {
  document.getElementById('home-page').addEventListener('click', function () {
    window.location.href = 'http://0.0.0.0:5000';
  });
  setupSuggestionPost();
  /**
 * Adds event listener for setting up form for submitting a suggestion
 *
 * @returns {undefined}
 */
  function setupSuggestionPost () {
    form = document.getElementById('suggestion-form');
    form.addEventListener('submit', postSuggestion);
  }
  /**
 * Gets HTML element values and posts suggestion data to internal REST API
 * @param {event object} event
 * @returns {undefined}
 */
  function postSuggestion (event) {
    event.preventDefault();
    suggestedArtist = document.getElementById('artist-text-area').value;
    suggestedSong = document.getElementById('song-text-area').value;
    suggestedWords = document.getElementById('words-text-area').value;
    name = document.getElementById('name-text-area').value;
    email = document.getElementById('email-text-area').value;
    suggestionDict = { suggested_artist: suggestedArtist, suggested_song: suggestedSong, suggested_words: suggestedWords, name: name, email: email };
    suggestionUrl = 'http://0.0.0.0:5001/api/v1/suggestions';
    fetch(suggestionUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(suggestionDict) })
      .then(response => response.json())
      .then(data => {
        document.getElementById('suggestion-form').style.display = 'none';
        confirmationDialog = "<br><p style=\"text-align: center;\">Thank you for your suggestion! We'll email you if we add the song!</p>";
        document.getElementById('suggestion-section').insertAdjacentHTML('beforeend', confirmationDialog);
      })
      .catch(error => console.error(error));
  }
});
