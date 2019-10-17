let index = window.location.href.lastIndexOf('/')
let id = window.location.href.substring(index + 1)
let song_api_url = 'http://0.0.0.0:5001/api/v1/songs/' + id
fetch(song_api_url)
.then(response => response.json())
.then(data => {
  document.getElementById('song_info').insertAdjacentHTML('beforeend', info_HTML(data));
})
.catch(error => console.error(error))
function info_HTML(song) {
  return(
    `<li>${song.artist}</li>
      <li>${song.title}</li>
      <li>${song.lyrics}</li>`)
}
