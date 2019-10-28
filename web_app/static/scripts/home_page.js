fetch('http://0.0.0.0:5001/api/v1/songs')
.then(response => response.json())
.then(data => {
  let i;
  let elem;
  for (i = 0; i < data.length; i++) {
    document.getElementById('songs').insertAdjacentHTML('beforeend', song_HTML(data[i]));
    setup_nav(data[i])
  }
})
.catch(error => console.error(error))
function song_HTML(song) {
  return(
      `<div class="col-md-6 col-lg-4">
      <div class="card border-0"><img class="card-img-top" src="${song.image_url}" alt="C\
ard Image">
      <div class="card-body">
      <h6><a href="#">${song.title}</a></h6>
      <p class="text-muted card-text">${song.artist}</p>
      <div class="btn-group">
      <button type="button" class="btn btn-sm btn-outline-secondary" id="${song.id}">View</button>
      </div>
      </div>
      </div>
      </div>`
)}
function setup_nav(song) {
  document.getElementById(song.id).addEventListener('click', function() {
    window.location.href="http://0.0.0.0:5000/songs/" + song.id
  }
)
}
