//Redirects user to page for specific song
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

//Fetchs and displays song details
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

//Adds event listeners so that information about each word can be fetched and displayed
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
	  selectedWord.innerHTML = `<b>Selected Word:</b> <i>${data['word']}</i>`
	  selectedWord.setAttribute("text", data['word'])
	  entries_label = document.getElementById('entries_label')
	  entries_label.innerHTML = `<b><u>Entries</u></b></p>`
	  document.getElementById('wordBreakdown').insertAdjacentHTML('beforeend', button_group_HTML())
	  document.getElementById('entries_button_group').innerHTML = ""
	  document.getElementById('wordTabs').innerHTML = ""
	  document.getElementById('myTabContent').innerHTML = ""
	  document.getElementById('wordTabs').classList.remove('nav', 'nav-tabs')
	  document.getElementById("wordCard").classList.remove("card")
	  document.getElementById("interpretation-section").innerHTML = ""
	  document.getElementById("interpretation-section").style.display="block";
	  console.log(document.getElementById("confirmationDialog"))
	  if (document.getElementById("confirmationDialog") != null) {
	    element = document.getElementById("confirmationDialog")
	    element.parentNode.removeChild(element)
	  }
	  document.getElementById("displaySection").innerHTML = ""
	  for (i = 0; i < data['results'].length; i++) {
	    document.getElementById('entries_button_group').insertAdjacentHTML('beforeend', button_HTML(i))
	    setup_entry(data, i)
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
function setup_entry(data, entry_id)
{
  document.getElementById(entry_id).addEventListener('click', function() {
    let tabDict = {}
    let keys = Object.keys(data['results'][entry_id])
    for(i = 0; i < keys.length; i++) {
      if (keys[i] == "definition"  || keys[i] == "synonyms" || keys[i] == "antonyms" || keys[i]  == "examples")
	tabDict[keys[i]] = data['results'][entry_id][keys[i]]
    }
    console.log(tabDict)
    document.getElementById("wordTabs").innerHTML = ""
    document.getElementById("myTabContent").innerHTML = ""
    document.getElementById("wordTabs").classList.add('nav', 'nav-tabs')
    append_tabs(tabDict)
    document.getElementById("wordCard").classList.add("card")
    if (!document.getElementById("prompt")) {
      add_interpretation_prompt(data)
      setup_post(data)
    }
    displayInterpretations()
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
function add_interpretation_prompt(data) {
  prompt = `<br><label for="interpretation-text-area" id="prompt">After exploring a few entries, share what you think the artist meant by <i>\"${data['word']}\"</i>...</label>`
  textArea = `<textarea class="form-control" form="interpretation-section" name="interpretation "id="interpretation-text-area" rows="3" ></textarea>`
  submitButton = `<br><button type="submit" class="btn btn-primary">Submit</button>`
  document.getElementById("interpretation-section").insertAdjacentHTML('beforeend', prompt)
  document.getElementById("interpretation-section").insertAdjacentHTML('beforeend', textArea)
  document.getElementById("interpretation-section").insertAdjacentHTML('beforeend', submitButton)
}
function setup_post(word) {
  form = document.getElementById("interpretation-section")
  form.addEventListener("submit", postInterpretation)
}
function postInterpretation(event) {
  event.preventDefault()
  word = document.getElementById("selectedWord").getAttribute("text")
  word_id_url = "http://0.0.0.0:5001/api/v1/words/" + word
  fetch(word_id_url)
    .then(response => response.json())
    .then(data => {
      interpretation = document.getElementById("interpretation-text-area").value
      interpretation_dict = {'text': interpretation}
      interpretation_url = "http://0.0.0.0:5001/api/v1/interpretations/" + data + '/' + id
      fetch(interpretation_url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(interpretation_dict)})
	.then(response => response.json())
	.then(data => {
	  document.getElementById("interpretation-section").style.display="none";
	  confirmationNode = document.createElement('div');
	  nodeContents = `<p id = "confirmationDialog">Thanks for your submission for <i>${word}</i>! Check back to see if others upvote it below!</p>`
	  document.getElementById("displaySection").before(confirmationNode)
	  confirmationNode.innerHTML = nodeContents
//	  document.getElementById("wordSection").insertAdjacentHTML('beforeend', confirmationDialog)
	  console.log(data)
	})
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
      }
function displayInterpretations() {
  word = document.getElementById("selectedWord").getAttribute("text")
  word_id_url = "http://0.0.0.0:5001/api/v1/words/" + word
  fetch(word_id_url)
    .then(response => response.json())
    .then(data => {
      fetch("http://0.0.0.0:5001/api/v1/interpretations/" + data + '/' + id)
	.then(response => response.json())
	.then(data => {
	  displaySection= setupDisplaySection(data)
	  document.getElementById("displaySection").insertAdjacentHTML("beforeend", displaySection)
	  contentDiv = document.getElementById("content-div")
	  if (data.length > 0) {
	    for (i = 0; i < data.length; i++) {
	      contentDiv.insertAdjacentHTML("beforeend", `<li>${data[i].text}</li>`)
	    }
	  }
	})
	.catch(error => console.error(error))})
}
function setupDisplaySection(interpretations) {
  word = document.getElementById("selectedWord").getAttribute("text")
  return(
    `<div class="accordion" id="accordionExample">
      <div class="card">
      <div class="card-header" id="headingOne">
      <h2 class="mb-0">
      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
      Interpretations for ${word}
    </button>
      </h2>
      </div>
      <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body" id="content-div">
      </div>
    </div>
  </div>
  </div>`)
}
