var typedWord = ""; //a variable that holds the word being typed on current .game-row

var gameOver = false;
var tries = 0;
//define a variable that holds page height without header element
var pageHeight = $(window).height() - $('header').height();
$('#game').css('height', pageHeight);

$('#help-button').click(function() {
    //show help text
    $('#help-text').show();
    //hide help text after 6 seconds
    setTimeout(function() {
        $('#help-text').hide();
    }, 6000);
});
$('#settings-button').click(function() {
    //show settings text
    $('#settings-text').show();
    //hide settings text after 6 seconds
    setTimeout(function() {
        $('#settings-text').hide();
    }, 6000);
});

//set #game-keyboard height to 22.5% of pageHeight variable
$('#game-keyboard').css('height', pageHeight * 0.225);
//set #board-container height to 77.5% of pageHeight variable
$('#board-container').css('height', pageHeight * 0.775);

//#board-container and #game-keyboard max-width is 500px
$('#board-container').css('max-width', '500px');
$('#game-keyboard').css('max-width', '500px');

/*
set each .game-row's height to #board's height divided by the number of rows
*/
$('.game-row').css('height', ($('#board').height() - 6) / 6);

/*Set each .game-tile's font size to fill it's container */
$('.game-tile').css('font-size', ($('.game-row').height()) / 1.6);


//function to get the word list from js/words.json jquery and return it
function getWordList() {
    var wordlist = $.ajax({
        url: 'js/words.json',
        dataType: 'json',
        async: false
    }).responseText;
    wordlist = JSON.parse(wordlist);
    return wordlist;
}

var wordList = getWordList();

//function to get a random word from /js/words.json using jquery and set it to var word
function getRandomWord() {
    var word = window.wordList;
    //make word lowercase
    word = word[Math.floor(Math.random() * word.length)].toUpperCase();
    return word;
}

wordOfTheSession = getRandomWord();
console.log('wordOfTheSession: ' + wordOfTheSession);

//if any .keyboard-key is clicked, type it's value to the first available .game-tile
$('.keyboard-key:not(#enter-button, #backspace-button)').click(function() {
    if (window.typedWord.length < 5 && gameOver === false) {
        var key = $(this).text();
        window.typedWord += key;
        console.log('typedWord: ' + typedWord);
        key = key.replace(/ı/g, 'I');
        key = key.replace(/i/g, 'İ');
        key = key.toUpperCase();
        var firstEmpty = $('.game-tile').filter(function() {
            return ($(this).text() === '');
        }).first();
        firstEmpty.text(key);
    }
});

//if any physical keyboard key is pressed, type it's value to the first available .game-tile
$(document).keypress(function(e) {
    //check if key pressed is a letter, also include turkish letters (ı,İ,ğ,Ğ,ç,Ç,ş,Ş,ö,Ö,ü,Ü)
    //turkish letters' unicode avlues are 305, 231, 351, 246, 252, 287, 304, 199, 350, 214, 220, 286
    if (window.typedWord.length < 5 && gameOver === false) {
        if (e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122 || e.which == 305 || e.which == 231 || e.which == 351 || e.which == 246 || e.which == 252 || e.which == 287 || e.which == 304 || e.which == 199 || e.which == 350 || e.which == 214 || e.which == 220 || e.which == 286) {
            //convert i to İ, ı to I using regex
            var key = String.fromCharCode(e.which);
            window.typedWord += key;
            console.log('typedWord: ' + typedWord);
            key = key.replace(/ı/g, 'I');
            key = key.replace(/i/g, 'İ');
            key = key.toUpperCase();
            var firstEmpty = $('.game-tile').filter(function() {
                return ($(this).text() === '');
            }).first();
            firstEmpty.text(key);
        }
    }
});

//if backspace is pressed, remove the last character from the tile before the first available .game-tile
$(document).keyup(function(e) {
    if (e.which === 8) {
        var lastLetterTyped = $('.game-tile').filter(function() {
            return ($(this).text() !== '');
        }).last();
        //remove last character from typedWord variable
        if (window.typedWord.length > 0 && gameOver === false) {
            lastLetterTyped.text('');
            window.typedWord = window.typedWord.slice(0, -1);
            console.log('typedWord: ' + typedWord);
        }
    }
});

$('#backspace-button').click(function() {
    var lastLetterTyped = $('.game-tile').filter(function() {
        return ($(this).text() !== '');
    }).last();
    //remove last character from typedWord variable
    if (window.typedWord.length > 0 && gameOver === false) {
        lastLetterTyped.text('');
        window.typedWord = window.typedWord.slice(0, -1);

    }
});

var dictionary = {};



function enter() {
    if (window.gameOver === false) {
        for (var i = 0; i < window.wordOfTheSession.length; i++) {
            var letter = window.wordOfTheSession[i];
            window.dictionary[letter] = 0;
        }
        for (var i = 0; i < window.wordOfTheSession.length; i++) {
            var letter = window.wordOfTheSession[i];
            window.dictionary[letter]++;
        }
        console.log(window.dictionary);
        if (window.typedWord.length === 5) {
            //check if typedWord is in wordList
            if (window.wordList.includes(window.typedWord)) {
                for (var i = 0; i < 5; i++) {
                    if (window.typedWord[i].toUpperCase() == window.wordOfTheSession[i]) {
                        $('.game-tile').eq(i + (tries * 5)).css('background-color', 'green');
                        $('.keyboard-key').filter(function() {
                            return ($(this).text() === window.typedWord[i].toLowerCase());
                        }).css('background-color', 'green');
                        window.dictionary[window.typedWord[i].toUpperCase()]--;
                    }
                    //check if window.typedWord[i] is in wordOfTheSession
                    else if (window.wordOfTheSession.includes(window.typedWord[i].toUpperCase()) && window.dictionary[window.typedWord[i].toUpperCase()] > 0) {
                        $('.game-tile').eq(i + (tries * 5)).css('background-color', '#b59f3b');
                        //if the letter's keyboard key is not green, make it yellow
                        if ($('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].toLowerCase());
                            }).css('background-color') !== 'green') {
                            $('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].toLowerCase());
                            }).css('background-color', '#b59f3b');
                            window.dictionary[window.typedWord[i].toUpperCase()]--;
                        }
                    } else {
                        $('.game-tile').eq(i + (tries * 5)).css('background-color', '#3a3a3c');
                        //if the letter's keyboard key is not green or yellow, make it red
                        if ($('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].toLowerCase());
                            }).css('background-color') !== 'green' && $('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].toLowerCase());
                            }).css('background-color') !== '#b59f3b') {
                            $('.keyboard-key').filter(function() {
                                return ($(this).text() === window.typedWord[i].toLowerCase());
                            }).css('background-color', '#3a3a3c');
                        }
                    }
                }

                if (window.typedWord.toUpperCase() === window.wordOfTheSession) {
                    alert('Tebrikler!');
                    window.gameOver = true;
                } else {
                    alert('Yanlış!');
                    typedWord = '';
                    window.tries += 1;
                }
                if (tries > 5) {
                    alert('Oyun Bitti!');
                    gameOver = true;
                }
                console.log(window.dictionary);
            } else {
                alert('Bu kelime sözlükte bulunamadı.')
            }


        } else {
            alert('Lütfen 5 harf giriniz.');
        }
    }
}



//if enter is pressed
$(document).keydown(function(e) {
    if (e.which === 13 && gameOver === false) {
        enter();
    }
});
//if #enter-button is clicked
$('#enter-button').click(function() {
    if (gameOver === false) {
        enter();
    }
});