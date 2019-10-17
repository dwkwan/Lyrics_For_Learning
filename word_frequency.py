#!/usr/bin/python3
"""This module prompts a user for a song and returns the top 10 words from it that are used least frequently in the English-speaking world"""
"""Import modules and defines Request Headers for Words API get request"""

import requests, re, operator
headers = {
    'x-rapidapi-host': "ENTER WORDS API HOST URL",
    'x-rapidapi-key': "ENTER API KEY FOR WORDS API"
    }

"""Prompt the user"""

print('Enter an artist and song! Then see the words from the song that are used least frequently in the English-speaking world!', '\n')
artist = input('Artist: ')
song = input('Song: ')

"""Fetch lyrics from lyrics.ovh based on user input and print them. Validate input data"""

lyrics_dict = requests.get('https://api.lyrics.ovh/v1/{:}/{:}'.format(artist, song)).json()
if lyrics_dict == None:
    print("Sorry, that song does not exist. Check your spelling and try again")
    exit
lyrics = lyrics_dict.get('lyrics')
print("Lyrics...", "\n", "\n", lyrics)

"""Prepare lyrics for analysis by removing punctuation, replacing newlines, and splitting lyrics string into list of word sub-strings"""

mod_lyrics = re.sub(r'[^\w\s]','', lyrics.replace('\n', " "))
words = mod_lyrics.split(" ")

"""Fetch breakdown of all words from Words API and stores the frequency of each word in a dictionary"""

result_dict = {}
for word in words:
    if result_dict.get(word.lower()) is None and result_dict.get(word.capitalize()) is None:
        url = "https://wordsapiv1.p.rapidapi.com/words/{:}".format(word)
        word_dict = requests.request("GET", url, headers=headers).json()
        if word_dict.get("frequency") is not None:
                       result_dict[word] = word_dict.get("frequency")
        else:
                       result_dict[word] = -1

"""Generates a list of tuples based on dictionary items. Sorts words by frequency in ascending order and prints the first 10"""

sorted_list = sorted(result_dict.items(), key=operator.itemgetter(1))
print(
    "Top 10 Words From \"{:}\" That Are Used Least Frequently In The ".format(
        song) + "English-Speaking World...", "\n")
count = 0
for item in sorted_list:
    if item[1] > 0:
        print("{:}: {:} ".format(item[0], item[1]))
        count = count + 1
        if count > 9:
            break
