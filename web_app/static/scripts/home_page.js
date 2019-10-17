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
    `<div class="col-md-4">
              <div class="card mb-4 box-shadow">
                <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&bg=55595c&fg=eceeef&text=Thumbnail" alt="Card image cap">
                <div class="card-body">
                  <p class="card-text">${song.title}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary" id="${song.id}">View</button>
                    </div>
                    <small class="text-muted">Rock</small>
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
