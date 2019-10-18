let index = window.location.href.lastIndexOf('/')
let id = window.location.href.substring(index + 1)
let song_api_url = 'http://0.0.0.0:5001/api/v1/songs/' + id
fetch(song_api_url)
.then(response => response.json())
.then(data => {
  document.getElementById('song_info').innerHTML = `${data.artist}, ${data.title}`;
  document.getElementById('lyrics').innerHTML = `${data.lyrics}`;
})
.catch(error => console.error(error))
