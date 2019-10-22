let index = window.location.href.lastIndexOf('/')
let id = window.location.href.substring(index + 1)
let song_api_url = 'http://0.0.0.0:5001/api/v1/songs/' + id
fetch(song_api_url)
.then(response => response.json())
.then(data => {
  console.log(data)
  document.getElementById('song_info').innerHTML = `${data.artist}, ${data.title}`;
  document.getElementById('lyrics').innerHTML = `${data.lyrics}`;
})
.catch(error => console.error(error))


let song_word_api_url = 'http://0.0.0.0:5001/api/v1/songs/' + id + '/words'
fetch(song_word_api_url)
.then(response => response.json())
.then(data => {
  for (i = 0; i < data.length; i++) {
    item = document.createElement("LI");
    text = document.createTextNode(data[i].text)
    item.appendChild(text)
    document.getElementById('wordlist').appendChild(item);
    setupWordFetch(item)
   }
  })
.catch(error => console.error(error))
function setupWordFetch(word) {
  word.addEventListener('click', function() {
    fetch("https://wordsapiv1.p.rapidapi.com/words/" + word.innerText,
	  {
	    headers: {
	      'x-rapidapi-host': "ENTER API HOST",
	      'x-rapidapi-key': "ENTER API KEY"
	    }
	  })
      .then(response => response.json())
	.then(data => {
	  selectedWord = document.getElementById('selectedWord')
	  selectedWord.innerHTML = `<b>Selected Word:</b> ${data['word']}`
	  entries_label = document.getElementById('entries_label')
	  entries_label.innerHTML = `<b><u>Entries</u></b></p>`
	  document.getElementById('wordBreakdown').insertAdjacentHTML('beforeend', button_group_HTML())
	  document.getElementById('entries_button_group').innerHTML = ""
	  document.getElementById('wordTabs').innerHTML = ""
	  document.getElementById('myTabContent').innerHTML = ""
	  document.getElementById('wordTabs').classList.remove('nav', 'nav-tabs')
	  document.getElementById("wordCard").classList.remove("card")
	  for (i = 0; i < data['results'].length; i++) {
	    document.getElementById('entries_button_group').insertAdjacentHTML('beforeend', button_HTML(i))
	    setup_entry(data['results'], i)
	    }
	  })
      .catch(error => console.error(error))
	})}
function button_group_HTML()
{
  return(
    `<div class="btn-group" role="group" aria-label="Basic example" id="entries_button_group">
      </div>`
  )
}
function button_HTML(index)
{
  return(`<button type="button" class="btn btn-secondary" id=${index}>${index}</button>`)
}
function setup_entry(data_results, entry_id)
{
  document.getElementById(entry_id).addEventListener('click', function() {
    let tabDict = {}
    let keys = Object.keys(data_results[entry_id])
    for(i = 0; i < keys.length; i++) {
      if (keys[i] == "definition"  || keys[i] == "synonyms" || keys[i] == "antonyms" || keys[i]  == "examples")
	tabDict[keys[i]] = data_results[entry_id][keys[i]]
    }
    console.log(tabDict)
    document.getElementById("wordTabs").innerHTML = ""
    document.getElementById("myTabContent").innerHTML = ""
    document.getElementById("wordTabs").classList.add('nav', 'nav-tabs')
    append_tabs(tabDict)
    document.getElementById("wordCard").classList.add("card")
  })
}
function append_tabs(tabDict) {
  tabDictKeys  = Object.keys(tabDict)
  for (i = 0; i < tabDictKeys.length; i++) {
    if (i == 0) {
      tab = `<li class="nav-item"><a class="nav-link active"` +
	`id="${tabDictKeys[i]}-tab" data-toggle="tab" href="#${tabDictKeys[i]}"`
	+ `role="tab" aria-controls="${tabDictKeys[i]}" aria-selected="true">${tabDictKeys[i]}</a></li>`
      tabContent = `<div class="tab-pane fade show active"` +
	`id="${tabDictKeys[i]}" role="tabpanel"` +
	`aria-labelledby="${tabDictKeys[i]}-tab"><p>${tabDict[tabDictKeys[i]]}</p></div>`
    }
    else {
      tab = `<li class="nav-item"><a class="nav-link"` +
	`id="${tabDictKeys[i]}-tab" data-toggle="tab"` +
      `href="#${tabDictKeys[i]}" role="tab" aria-controls="${tabDictKeys[i]}" aria-selected="true">${tabDictKeys[i]}</a></li>`
      tabContent = `<div class="tab-pane fade" id="${tabDictKeys[i]}"` +
	`role="tabpanel" aria-labelledby="${tabDictKeys[i]}-tab">${tabDict[tabDictKeys[i]]}</div>`
    }
    document.getElementById("wordTabs").insertAdjacentHTML('beforeend', tab)
    document.getElementById("myTabContent").insertAdjacentHTML('beforeend', tabContent)
  }
}
