// Fetches all songs from internal REST API and sets up the homepage for navigation to other pages
document.addEventListener('DOMContentLoaded', function (event) {
  fetch('http://0.0.0.0:5001/api/v1/songs')
    .then(response => response.json())
    .then(data => {
      data = data.sort();
      for (let i = 0; i < data.length; i++) {
        document.getElementById('songs').insertAdjacentHTML('beforeend', songHTML(data[i]));
        console.log(setupNav(data[i]));
      }
    })
    .catch(error => console.error(error));
  document.getElementById('suggest').addEventListener('click', function () {
    window.location.href = 'http://0.0.0.0:5000/suggest/';
  });
  /**
* Creates and populates HTML card for song
*
* @param {Song object} song
* @returns {HTML} populated card
*/
  function songHTML (song) {
    return (
      `<div class="col-md-6 col-lg-4">
      <div class="card border-0"><img style="height: 300px" class="border rounded-circle card-img-top" src="${song.image_url}" alt="C\
ard Image">
      <div class="card-body">
      <h6><a href="#" style="font-family: 'Open Sans', sans-serif;">${song.title}</a></h6>
      <p class="text-muted card-text" style="font-family: 'Open Sans', sans-serif;">${song.artist}</p>
      <div class="btn-group">
      <button type="button" class="btn btn-sm btn-outline-secondary" id="${song.id}" style="font-family: 'Open Sans', sans-serif;">View</button>
      </div>
      </div>
      </div>
      </div>`
    );
  }
  /**
* Sets up event listener to redirect user to selected song page
*
* @param {Song object} song
* @returns undefined
*/
  function setupNav (song) {
    document.getElementById(song.id).addEventListener('click', function () {
      window.location.href = 'http://0.0.0.0:5000/songs/' + song.id;
    }
    );
  }
});
