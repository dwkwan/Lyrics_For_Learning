document.addEventListener('DOMContentLoaded', function (event) {
  const index = window.location.href.lastIndexOf('/');
  const id = window.location.href.substring(index + 1);
  const songApiUrl = 'http://0.0.0.0:5001/api/v1/songs/' + id;
  songDetails(songApiUrl);
  songWords(id);
  console.log("first");

// Fetches all data for specific song and sets up navigation to other songs with same genre
  async function songDetails(songApiUrl) {
    try {
      let songApiResponse = await fetch(songApiUrl)
      let songData = await songApiResponse.json()
      document.getElementById('song-title').innerHTML = `${songData.title}`;
      document.getElementById('song-artist').innerHTML = `${songData.artist}`;
      document.getElementById('song-lyrics').innerHTML = `${songData.lyrics}`;
      document.getElementById('song-genre').innerHTML = `Genre: ${songData.genre}`;
      document.getElementById('song-genre').setAttribute('text', songData.genre);
      document.getElementById('song-image').setAttribute('src', songData.image_url);
      genre = document.getElementById('song-genre').getAttribute('text');
      const genreApiUrl = 'http://0.0.0.0:5001/api/v1/songs/genre/' + genre;
      console.log("second");
      let genreApiResponse = await fetch(genreApiUrl)
      genreData = await genreApiResponse.json()
      if (genreData.length > 1) {
        document.getElementById('genre-suggestions').insertAdjacentHTML('beforeEnd', `<p>Other ${genreData[0].genre} songs to explore:</p><ul id="suggestion-list"></ul><a class="card-link" href="#"></a>`);
        suggestionDict = suggestions(genreData);
        for (const [key, value] of Object.entries(suggestionDict)) {
          item = document.createElement('LI');
          text = document.createTextNode(value);
          item.appendChild(text);
          item.setAttribute('id', key);
          document.getElementById('suggestion-list').appendChild(item);
          suggestionNav(key);
        }
      } else {
        document.getElementById('genre-suggestions').insertAdjacentHTML('beforeEnd', `<p>Check back for more ${genreData[0].genre} songs!</p><a class="card-link" href="#"></a>`);
      }} catch(err){
	console.error(err);
    }}

  // Fetches associated words and modifies lyrics HTML for highlighting of selected words
  async function songWords(id) {
    try {
      const songWordsApiUrl = 'http://0.0.0.0:5001/api/v1/songs/' + id + '/words';
      let songWordsResponse = await fetch(songWordsApiUrl);
      let songWordsData = await songWordsResponse.json();
      console.log("third");
      for (i = 0; i < songWordsData.length; i++) {
	item = document.createElement('LI');
	text = document.createTextNode(songWordsData[i].text);
	item.appendChild(text);
	document.getElementById('wordlist').appendChild(item);
	setupWordFetch(item);
      }
      featuredWords = document.getElementById('wordlist').querySelectorAll('li');
      modFeaturedWords = [];
      for (i = 0; i < featuredWords.length; i++) { modFeaturedWords.push(featuredWords[i].innerText); }
      lyrics = document.getElementById('song-lyrics').innerHTML;
      console.log(lyrics);
      modLyrics = lyrics.replace(/\n/g, '+\n');
      console.log('Modified: ' + modLyrics);
      words = modLyrics.split(/\+| /);
      console.log(words);
      for (i = 0; i < words.length; i++) {
        console.log(words[i]);
        if (modFeaturedWords.includes(words[i].replace(/[\".,\/#!$%\^&\*;:{}=\-_`~()\n]/g, ''))) {
          console.log('Found: ' + words[i]);
          words[i] = `<span class = ${words[i].replace(/[\".,\/#!$%\^&\*;:{}=\-_`~()]/g, '')}>` + words[i] + '</span>';
        }
      }
      document.getElementById('song-lyrics').innerHTML = words.join(' ');
    } catch(err) {
      console.error(err);
    }
  }

  /**
 * Sets up event listener to fetch word info and highlight words within lyrics
 *
 * @param {string} word
 * @returns {undefined}
 */
  async function setupWordFetch (word) {
    try {
      const wordsApiUrl = 'http://0.0.0.0:5001/api/v1/words_api/' + word.innerText;
      word.addEventListener('click', async function () {
	let wordsApiResponse = await fetch(wordsApiUrl)
	let wordsApiData = await wordsApiResponse.json()
	selectedWord = document.getElementById('selectedWord');
	selectedWord.innerHTML = `<b>Selected word:</b> <i>${wordsApiData.word}</i>`;
	selectedWord.setAttribute('text', wordsApiData.word);
	document.getElementById('word-specific').style.display = 'block';
	entriesLabel = document.getElementById('entries_label');
	entriesLabel.innerHTML = '<b><u>Entries</u></b></p>';
	document.getElementById('wordBreakdown').insertAdjacentHTML('beforeend', buttonGroupHTML());
	document.getElementById('entries_button_group').innerHTML = '';
	document.getElementById('wordTabs').innerHTML = '';
	document.getElementById('myTabContent').innerHTML = '';
	document.getElementById('wordTabs').classList.remove('nav', 'nav-tabs');
	document.getElementById('wordCard').classList.remove('card');
	document.getElementById('interpretation-section').innerHTML = '';
	document.getElementById('interpretation-section').style.display = 'block';
	if (document.getElementById('confirmationDialog') != null) {
	  element = document.getElementById('confirmationDialog');
	  element.parentNode.removeChild(element);
	}
	document.getElementById('displaySection').innerHTML = '';
	highlightedWords = document.getElementsByClassName('highlighted');
	while (highlightedWords.length > 0) {
	  highlightedWords[0].removeAttribute('style');
	  highlightedWords[0].classList.remove('highlighted');
	}
	wordsToHighlight = document.getElementsByClassName(`${wordsApiData.word}`);
	for (i = 0; i < wordsToHighlight.length; i++) {
	  wordsToHighlight[i].setAttribute('style', 'background-color: #FFFF00');
	  wordsToHighlight[i].className += ' highlighted';
	}
	for (i = 0; i < wordsApiData.results.length; i++) {
	  document.getElementById('entries_button_group').insertAdjacentHTML('beforeend', buttonHTML(i));
	  setupEntry(wordsApiData, i);
	}
      })} catch(err) {
	console.error(error);
      }}

  /**
 * Creates button group for menu of word entries
 *
 * @returns {HTML}
 */
  function buttonGroupHTML () {
    return (
    `<div class="btn-group flex-wrap" role="group" aria-label="Basic example" id="entries_button_group">
      </div>`
    );
  }
  /**
 * Creates button for word entry in button group
 *
 * @param {number} index
 * @returns {undefined}
 */
  function buttonHTML (index) {
    return (`<button type="button" class="btn btn-secondary" id=${index}>${index}</button>`);
  }
  /**
 * Adds event listener so key info about each word can be displayed in tabs
 *
 * @param {dictionary} data
 * @param {number} entryId
 * @returns {undefined}
 */
  function setupEntry (data, entryId) {
    document.getElementById(entryId).addEventListener('click', function () {
      const tabDict = {};
      const keys = Object.keys(data.results[entryId]);
      for (i = 0; i < keys.length; i++) {
        if (keys[i] == 'definition' || keys[i] == 'partOfSpeech' ||
	  keys[i] == 'synonyms' || keys[i] == 'antonyms' ||
	  keys[i] == 'examples') {
          if (data.results[entryId][keys[i]] != null) { tabDict[keys[i]] = data.results[entryId][keys[i]]; }
        }
      }
      document.getElementById('wordTabs').innerHTML = '';
      document.getElementById('myTabContent').innerHTML = '';
      document.getElementById('wordTabs').classList.add('nav', 'nav-tabs');
      appendTabs(tabDict);
      document.getElementById('wordCard').classList.add('card');
      if (!document.getElementById('prompt')) {
        addInterpretationPrompt(data);
        setupPost();
      }
      if (document.getElementById('displaySection').innerHTML == '') { displayInterpretations(); }
    });
  }
  /**
 * Sets up display of tabs and associated panels for content
 *
 * @param {dictionary} tabDict
 * @returns {undefined}
 */
  function appendTabs (tabDict) {
    tabDictKeys = Object.keys(tabDict);
    for (i = 0; i < tabDictKeys.length; i++) {
      if (i == 0) {
        tab = '<li class="nav-item"><a class="nav-link active"' +
	`id="${tabDictKeys[i]}-tab" data-toggle="tab" href="#${tabDictKeys[i]}"` +
	`role="tab" aria-controls="${tabDictKeys[i]}" aria-selected="true">${tabDictKeys[i]}</a></li>`;
        tabContent = '<div class="tab-pane fade show active"' +
	`id="${tabDictKeys[i]}" role="tabpanel"` +
	`aria-labelledby="${tabDictKeys[i]}-tab"><p>${tabDict[tabDictKeys[i]]}</p></div>`;
      } else {
        tab = '<li class="nav-item"><a class="nav-link"' +
	`id="${tabDictKeys[i]}-tab" data-toggle="tab"` +
      `href="#${tabDictKeys[i]}" role="tab" aria-controls="${tabDictKeys[i]}" aria-selected="true">${tabDictKeys[i]}</a></li>`;
        tabContent = `<div class="tab-pane fade" id="${tabDictKeys[i]}"` +
	`role="tabpanel" aria-labelledby="${tabDictKeys[i]}-tab">${tabDict[tabDictKeys[i]]}</div>`;
      }
      document.getElementById('wordTabs').insertAdjacentHTML('beforeend', tab);
      document.getElementById('myTabContent').insertAdjacentHTML('beforeend', tabContent);
    }
  }
  /**
 * Creates and inserts HTML for submitting interpretations
 *
 * @param {dictionary} data
 * @returns {undefined}
 */
  function addInterpretationPrompt (data) {
    prompt = `<br><label for="interpretation-text-area" id="prompt">After exploring a few entries, share what you think the artist means by <i>\"${data.word}\"</i>...</label>`;
    textArea = '<textarea class="form-control" form="interpretation-section" name="interpretation "id="interpretation-text-area" rows="3" ></textarea>';
    submitButton = '<br><button type="submit" class="btn btn-primary">Submit</button>';
    document.getElementById('interpretation-section').insertAdjacentHTML('beforeend', prompt);
    document.getElementById('interpretation-section').insertAdjacentHTML('beforeend', textArea);
    document.getElementById('interpretation-section').insertAdjacentHTML('beforeend', submitButton);
  }
  /**
 * Adds event listener for postinhg of interpretation to internal REST API
 *
 * @returns {undefined}
 */
  function setupPost () {
    form = document.getElementById('interpretation-section');
    form.addEventListener('submit', postInterpretation);
  }
  /**
 * Checks for profanity in interpretation, makes POST request to internal REST API, and displays confirmation dialog
 *
 * @param {event object} event
 * @returns {undefined}
 */
  async function postInterpretation (event) {
    try {
      event.preventDefault();
      word = document.getElementById('selectedWord').getAttribute('text');
      wordIdUrl = 'http://0.0.0.0:5001/api/v1/words/' + word;
      let wordIdResponse = await fetch(wordIdUrl);
      let wordIdData = await wordIdResponse.json();
      console.log(wordIdData);
      interpretation = document.getElementById('interpretation-text-area').value;
      interpretationDict = { text: interpretation };
      interpretationUrl = 'http://0.0.0.0:5001/api/v1/interpretations/' + wordIdData + '/' + id;
      let interpretationUrlResponse = await fetch(
	interpretationUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(interpretationDict) })
      let interpretationData = interpretationUrlResponse.json()
      document.getElementById('interpretation-section').style.display = 'none';
      if ('error' in interpretationData && interpretationData.error == 'Profane') {
	confirmationDialog = `<br><p id = "confirmationDialog">Your submission for <i>${word}</i> contains profane content. It will not be posted.</p>`;
      } else {
	confirmationDialog = `<br><p id = "confirmationDialog">Thanks for your submission for <i>${word}</i>!</p>`;
      }
      document.getElementById('word-specific-body').insertAdjacentHTML('beforeend', confirmationDialog);
    }
    catch(err) {
      console.error(err);
    }}

  /**
 * Fetches and displays intepretations for word in specific song
 *
 * @returns {undefined}
 */
  async function displayInterpretations () {
    try {
      word = document.getElementById('selectedWord').getAttribute('text');
      wordIdUrl = 'http://0.0.0.0:5001/api/v1/words/' + word;
      let wordIdResponse = await fetch(wordIdUrl);
      let wordIdData = await wordIdResponse.json();
      let interpretationsApiResponse = await fetch('http://0.0.0.0:5001/api/v1/interpretations/' + wordIdData + '/' + id)
      let interpretationsData = await interpretationsApiResponse.json()
      displaySection = setupDisplaySection();
      document.getElementById('displaySection').insertAdjacentHTML('beforeend', displaySection);
      contentDiv = document.getElementById('content-div');
      if (interpretationsData.length > 0) {
	for (i = 0; i < interpretationsData.length; i++) {
	  contentDiv.insertAdjacentHTML('beforeend', `<p class="card-text">"<i>${interpretationsData[i].text}</i>"</p>`);
	}
      } else {
	contentDiv.insertAdjacentHTML('beforeend', `<p class="card-text">Be the first to share what you think the artist means by <i>${word}</i></p>`);
      }} catch(err) {
	console.error(err);
      }}

  /**
 * Creates HTML for displaying interpretations
 *
 * @returns {HTML} displaySection
 */
  function setupDisplaySection () {
    word = document.getElementById('selectedWord').getAttribute('text');
    return (
`<div role="tablist" id="accordion-1">
    <div class="card">
        <div class="card-header" role="tab">
            <h5 class="mb-0"><a data-toggle="collapse" aria-expanded="false" aria-controls="accordion-1 .item-1" href="#accordion-1 .item-1">Latest Intepretations for <i>${word}</i></a></h5>
        </div>
        <div class="collapse item-1" role="tabpanel" data-parent="#accordion-1">
            <div class="card-body" id="content-div">
            </div>
        </div>
    </div>
</div>`);
}
/**
 * Returns of dictionary of other songs within the same genre based on API response from internal RESTful API
 *
 * @returns {dictionary} suggestionDict
 */
function suggestions (data) {
  if (data.length > 0) {
    suggestionDict = {};
    for (i = 0; i < data.length; i++) {
      if (data[i].title != document.getElementById('song-title').innerHTML) { suggestionDict[data[i].id] = data[i].title; }
    }
    return (suggestionDict);
  }
}
/**
 * Adds event listener for redirection to other song pages within same genre
 *
 * @returns {undefined}
 */
function suggestionNav (id) {
  document.getElementById(id).addEventListener('click', function () {
    window.location.href = 'http://0.0.0.0:5000/songs/' + id;
  });
}
});
