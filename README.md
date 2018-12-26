# Menu Translator

### [Demo](https://floating-stream-26119.herokuapp.com/)

### Problem
I often have trouble ordering food from menus with food I'm less familiar with, and this problem becomes even more severe when I'm traveling. When encountered with an unfamiliar menu, the choice is to either stick with what I know and miss out on the potential good food, or risk having a bad meal that I'm too embarrased to leave unfinished, which happens quite often to me unfortunatly... So I found myself looking up every other word on the menu on google translate, and sometimes even the translation doesn't make sense, in which case I then search for an image to try to understand what's in the food. Because of that I would end up going back and forth between Google Image and Google Translate for each word on the menu. 

### Solution
Woudln't it be nice if I can just take a picture and get the full translation of the menu? Google Traslate can translate text from images, but it doesn't work great in this case, because it treats the menu as full text document and requires you to slide your finger across texts to select them. I wanted something that is more instantaneous, and something that wlll simultaneously search for an image as well because sometimes a picture is worth a thousand words. That is the idea behind this project. 

### Usage
Click the upload button to upload image of a menu. This app automatically recognizes words and languages from the uploaded image and returns the translated text. Once you select the languages you want translate to, it will highlight all words on the image with translations available. Select a highligted word and you will see the translation below as well as images asociated with the selected text.

### Tech Stack
JavaScript, CSS, jQuery, Google Vision OCR, Google Translate, Google Image Search, Heroku
