/************************************************************************
 * Creates a cache for the dictionary and sets up UI functionality
 ************************************************************************/
function initialize() {
    //Turn array into object and store pertinant values with each word
    var cache = createCache(dictionary);
    
    $(".cta").click(function(e) {
        //Prevent Link Action
        e.preventDefault();
        
        //Get Letters Entered
        var value = $("#scrabbleLetters").val();
        
        //Check for words that contain all those letters
        var matchedWords = filterWords(cache, value);
        
        //Keep Checking Until We Find Something or Nothing At All
        while (matchedWords.length < 1 && value.length > 0) {
            //Remove a letter
            value = removeLeastValuableLetter(value);
            
            //Get new matched words
            matchedWords = filterWords(cache, value);
        }
        
        if (value.length > 0) {
            //Sort the words
            sortWords(matchedWords);
            
            //Display Those Words
            displayWords(matchedWords);
        }
        else {
            displayNoWordsMessage();
        }
        
        //Show Matched Words Section
        $(".matches").show();
    });
}



/************************************************************************
 * Removes the least valuable letter from the string of characters
 * 
 * returns: string without the least valuable letter
 * 
 * str: a string of characters
 ************************************************************************/
function removeLeastValuableLetter(str) {
    var letters = new Array();
    
    //Add each letter to the array with its Scrabble value
    for (var i = 0; i < str.length; i++) {
        var l = str.charAt(i);
        
        var letter = {
            letter: l,
            scrabbleValue: getScrabbleValue(l)
        };
        
        letters.push(letter);
    }
    
    //Sort Array by Scrabble value
    letters.sort(sortByScrabbleValueDesc);
    
    //Create a string from all but last letter
    str2 = "";
    
    for (var i = 0; i < letters.length - 1; i++) {
        str2 += letters[i].letter
    }
    
    return str2;
}

/************************************************************************
 * Displays a message that no words were found
 ************************************************************************/
function displayNoWordsMessage() {
    var selector = ".matchedWords";
    var html = "<div class='headline'>Yikes! That&rsquo;s not a great set of letters. You might want to consider swapping some.</div>";
    
    $(selector).html(html);
}

/************************************************************************
 * Displays all of the words in the provided array
 *
 * words: an array of words to display
 ************************************************************************/
function displayWords(words) {
    var selector = ".matchedWords";
    var html = "";
    
    //Display words if there are some
    if (words.length > 0) {
        for (var i = 0; i < words.length; i++) {
            html += words[i].word + " (" + words[i].scrabbleValue + ")<br />";    
        }
    }
    //Display sorry message if there aren't any
    else {
        html += "<div class='headline'>Yikes! That&rsquo;s not a great set of letters. You might want to try removing a letter and searching again or consider swapping some.</div>";
    }
    
    $(selector).html(html);
}

/************************************************************************
 * Sorts an array or words based on their Scrabble value from largest to
 * smallest
 *
 * returns: a sorted array of words
 * 
 * words: an array of words stored with a scrabbleValue
 ************************************************************************/
function sortWords(words) {
    return words.sort(sortByScrabbleValueDesc);
}

/************************************************************************
 * Sort function used to sort an array of words by their Scrabble
 * value in descending order
 * 
 * Usage Example: words.sort(sortByScrabbleValueDesc);
 *
 * returns: Sort order
 * 
 * a: first word
 * b: second word
 ************************************************************************/
function sortByScrabbleValueDesc(a, b) {
    return b.scrabbleValue - a.scrabbleValue;
}

/************************************************************************
 * Filters the set of words provided, removing those that don't match
 * the specified filter
 *
 * returns: Words that match the filter
 * 
 * words: an array of words stored with a hashValue
 * filter: a string of characters to match within words
 ************************************************************************/
function filterWords(words, filter) {
    //Get Hash Value to Compare
    var filterHash = getHashValue(filter);
    
    //Return new array of filtered words
    return words.filter(function(a, b) {
        //Check if word contains letters
        var hashValue = a.hashValue
        
        //Perform modulus to check if letter exists in each word                  
        var mod = -1;

        if (filterHash < hashValue) {
            mod = hashValue % filterHash;
        }
        else {
            mod = filterHash % hashValue;
        }
        
        //Word contains letters in filter, add word to data object
        if (mod === 0) {
            return true;
        }
        
        return false;
    });
}

/************************************************************************
 * Creates an array of words, storing their hash value and Scrabble
 * value with them.
 *
 * returns: An array of words and their cached values
 * 
 * data: An array of words to create the cache from
 ************************************************************************/
function createCache(data) {
    //Create cache object
    var cache = new Array();
    
    //Loop through provided data
    for (var i = 0; i < data.length; i++) {
        //Get word from data
        var word = data[i];
        
        //Add word, Scrabble Value and Hash to Cache
        cache.push({ 
            word: word,
            scrabbleValue: getScrabbleValue(word), 
            hashValue: getHashValue(word)
        });
    }
    
    //Return cache
    return cache;
}

/************************************************************************
 * Gets the hash value of the specified word
 *
 * returns: An integer representing a hash value
 * 
 * word: The word, represented in a string, to get the hash value for
 ************************************************************************/
function getHashValue(word) {
    //Set start value
    var value = 1;
    
    //Get length of word
    var length = word.length;
    
    //Loop through each character to get its value
    for (i = 0; i < length; i++) {
        //Get character at current position
        var char = word.charAt(i);
        
        //Add Scrabble value of character to running total
        value *= letterValues[char].hash;
    }
    
    return value;
}

/************************************************************************
 * Gets the Scrabble value of the specified word
 *
 * returns: An integer representing a Scrabble value
 * 
 * word: The word, represented in a string, to get the Scrabble value for
 ************************************************************************/
function getScrabbleValue(word) {
    //Set start value
    var value = 0;
    
    //Get length of word
    var length = word.length;
    
    //Loop through each character to get its value
    for (i = 0; i < length; i++) {
        //Get character at current position
        var char = word.charAt(i);
        
        //Add Scrabble value of character to running total
        value += letterValues[char].value;
    }
    
    return value;
}