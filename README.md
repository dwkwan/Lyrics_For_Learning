# ![Logo](https://i.imgur.com/U9YCwwT.png) 

[Lyrics For Learning](http://lyricsforlearning.net/) is a web application aimed at helping students practice their English language skills through music. Upon visiting the site, you can select a popular song and explore the meaning of words within the lyrics. Specifically, you can check out a linguistic breakdown of each word and share what you think the word means within the context of the song.


## Table of content

- [Inspiration](#inspiration)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Features](#features)
    - [Song Selection](#song-selection)
    - [Words To Explore](#words-to-Explore)
    - [Linguistic Breakdown and Highlighting Of Selected Words](#linguistic-breakdown-and-highlighting-of-selected-words)
    - [Submit interpretations and view past submissions](#submit-interpretations-and-view-past-submissions)
    - [Suggest a Song Form](#suggest-a-song)
- [API](#API)
- [Future](#future)
- [Attributions](#attributions)
- [Author](#author)

## Inspiration

Before I discovered my passion for software engineering, I was a middle school special educator in Brooklyn, NY. As a teacher, I found that music was such a powerful way to help my students learn language since they all had a natural connection to it and it provided a context for their learning. Drawing from my experiences in the classroom, I was inspired to create Lyrics For Learning.

Initially, Lyrics for Learning was going to solely allow students to check out linguistic breakdowns for words within songs. However, after reflecting upon how I leveraged music in my own classroom and getting feedback from other teachers, I decided to also allow users to share their own interpretations of what words mean within songs. By exploring both the literal and figurative meaning of words in songs they know, students can deepen their understanding of the English language in a context that is familiar to them.

## Built With

### Tools

# ![Tools](https://i.imgur.com/vKyy1ZR.png)

### Architecture

# ![Architecture](https://i.imgur.com/E3TaTuX.png)

## Getting Started

To start using this web application, visit lyricsforlearning.net. To install it, simply clone this repository. You can start the app by running `web_app.app` and `api.v1.app` as Python modules in separate terminal windows. Please note, in order to run this app, you will need to install necessary dependencies as well as pass in the correct MySQLdb and Words API credentials respectively.

## Features

### **Song selection**

Lyrics For Learning provides a selection of "clean" and vocabulary-rich songs to explore from a variety of different genres. The data for each song is fetched from the internal RESTful API and is used to fill each Bootstrap card. The song's id is used as the id for the "View" button within the song's card. This allows for the correct song details to be fetched when the user clicks on the button since the id becomes part of the URL for the song.

# ![song-selection](https://i.imgur.com/h3m9fko.png)

### **Words To Explore**

When a user selects a song, they are re-directed to a song-specific page where the song's details are fetched from the internal RESTful API. This includes a list of words to explore that appear in the lyrics for the song. Event listeners are setup on each word so that the linguistic breakdown of it can be fetched from an external API and so that it can be highlighted within the lyrics.

# ![words-to-explore](https://i.imgur.com/rqWAp1R.png)

### **Linguistic Breakdown and Highlighting of Words**


When a user selects a specific word from a song, the linguistic breakdown is fetched from the external Words API. The JS script will then create a menu based the number of entries available for the word. When a user clicks on one of the entries, the script will then see what sections are available for that entry (ex: "Definition", "Synonyms", "Examples"). The available sections and their content will populate a dynamic tabbed interface for the user to browse. In addition, the word is highlighted in the lyrics. This was made possible by first parsing the lyrics and adding span elements around words that appear in the "Pick a word to explore!" list. The spans have aligned classes added to them that allow them to be targeted and thus highlighted when a word is selected.

# ![linguistic-breakdown-and-highlighting-of-words](https://i.imgur.com/7kdV7Ox.png)

### **Submit Interpretations and View Past Interpretations**

After exploring the linguistic breakdown of a word, the user can share what they think the artist means by the word. When they press "Submit", their interpretation is sent as a `POST` request to the internal RESTful API. The `better-profanity` module is then used to check the interpretation for profanity and if so, the submission is not stored in the database and a warning dialog is displayed to the user. If there is no profanity, the submission is stored in the database and can be seen in the "Latest Interpretations" section, which is an accordian-style display.

# ![submit-interpretations-and-view-past-interpretations](https://i.imgur.com/LylEZMG.png)

### **Suggest a Song Form**

If a user would like to suggest a song to be added to the collection of songs to learn from, they can visit the "Suggest a Song" page and fill out the form. The form will ask for all necessary attributes for creating a new Song object including the song's artist, title, and words to learn from. The user must also submit their email and name so they can be notified if the song is added to the collection and receive credit for their contribution.

# ![suggest-a-song-form](https://i.imgur.com/jspGhrb.png)

## API

I built an internal RESTful API for this web application so that data can be flexibly retreived from the MySQLdb. All available endpoints can be found in the `api.v1.views` directory. Here's a description of each endpoint:

/api/v1/interpretations/<word_id>/<song_id>

* GET: Retrieves all Interpretation objects for a word from a song and returns a list containing
    all of them
    
* POST: Creates an interpretation for a word from a song

/api/v1/interpretations/<interpretation_id>

* PUT: Updates an Interpretation object

/api/v1/songs/<song_id>/words

* GET: Retrieves all words from a song and returns a list containing
    all of them

/api/v1/songs

* GET: Retrieves all Song objects from database and returns a list containing
    all of them

/api/v1/songs/<text>
  
* GET: Retrieves Song object from database and returns a dictionary

/api/v1/songs/genre/<genre>
  
* GET: Retrieves all Song objects from database with a specified genre

/api/v1/suggestions/

* GET: Retrieves all Suggestion objects from database and returns a list containing
    all of them
    
* POST: Creates a Suggestion object

/api/v1/words/<text>
  
* GET: Retrieves word_id based on word

/api/v1/words_api/<text>

* GET: Retrieves data for word from external API and returns response to client-side.
     By passing in API credentials from the command line when running the API and 
     using the internal API for the fetch, it prevents credentials from being exposed
     on the front-end.
     
## Future

Beyond this initial MVP which was built in 2 weeks, I would like to continue to add many more features to Lyrics For Learning. In particular, I would like to setup an authentication system. With this, I would also like to enable users to have profiles so they can check out their past progress and further personalize the experience by suggesting songs and words to explore based on past use. In addition, I'd like to allow users to edit past submissions and upvote each other's interpretations as well. I am also considering adding a "Top Users" board on the homepage too.

If you have any feedback (ex: feature ideas) or would like to contribute to this project, please feel free to contact me.

## Attributions

Shout-out to [Open Lyrics Database](https://github.com/Lyrics/lyrics) for the lyrics shown!

Licenses for images from Wikimedia Commons:

* [The xx at the Alcatraz.jpg](https://commons.wikimedia.org/wiki/File:The_xx_at_the_Alcatraz.jpg)
* [Adele Live 2016 tour.jpeg](https://commons.wikimedia.org/wiki/File:Adele_Live_2016_tour.jpeg)
* [Paul Simonon The Clash September 20 1979 Palladium NYC.jpg](https://commons.wikimedia.org/wiki/File:Paul_Simonon_The_Clash_September_20_1979_Palladium_NYC.jpg)

## Author
### **David Kwan**

David Kwan is a former teacher and current full stack software engineer with a passion for creating products that connect and empower others. He used his skills on the back-end and front-end to create Lyrics for Learning.

[Github](https://github.com/dwkwan)
[LinkedIn](https://www.linkedin.com/in/david-kwan-1b0930129/)
[Twitter](https://twitter.com/davidwkwan)



