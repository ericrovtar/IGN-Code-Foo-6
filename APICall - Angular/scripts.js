var articlesIndex = 0;
var videosIndex = 0;

/************************************************************************
 * Initializes functionality and loads initial data
 ************************************************************************/
function initialize() {
    //Load initial data
    loadArticles(0, 10);
    loadVideos(0, 10);

    //Setup buttons
    setupArticlesLoadMore();
    setupVideosLoadMore();
}

/************************************************************************
 * Sets up the Load More Articles link so it loads the number next number
 * of articles based on the current number of articles set to display
 ************************************************************************/
function setupArticlesLoadMore() {
    var articlesButton = ".loadMoreArticles";  
    var numberOfArticles = ".numberOfArticles";

    $(articlesButton).click(function(e) {
        //Prevent Link Default Action
        e.preventDefault();

        //Get Current Number Chosen
        var count = $(numberOfArticles).val();

        //Load More Articles
        loadArticles(articlesIndex, count);
    });
}

/************************************************************************
 * Sets up the Load More Videos link so it loads the number next number 
 * of articles based on the current number of articles set to display
 ************************************************************************/
function setupVideosLoadMore() {
    var videosButton = ".loadMoreVideos";  
    var numberOfVideos = ".numberOfVideos";

    $(videosButton).click(function(e) {
        //Prevent Link Default Action
        e.preventDefault();

        //Get Current Number Chosen
        var count = $(numberOfVideos).val();

        //Load More Videos
        loadVideos(videosIndex, count);
    });
}

/************************************************************************
 * Loads Articles by retrieving data from the API and then displaying
 * the data
 *
 * startIndex: the index of the first article to load
 * count: the number of articles to load
 ************************************************************************/
function loadArticles(startIndex, count) {
    var options = {
        startIndex: startIndex,
        count: count
    }

    showLoading(".articles");  
    
    getData("articles", options, displayArticles);
}

/************************************************************************
 * Loads Videos by retrieving data from the API and then displaying
 * the data
 *
 * startIndex: the index of the first video to load
 * count: the number of video to load
 ************************************************************************/
function loadVideos(startIndex, count) {
    var options = {
        startIndex: startIndex,
        count: count
    }
    
    showLoading(".videos");  

    getData("videos", options, displayVideos);
}

/************************************************************************
 * Displays a loading message overlaying the specified section.
 *
 * containerClass: the object to overlay; ensure the containerClass has
 *                 position set to relative
 ************************************************************************/
function showLoading(containerClass) {
    var overlay = $("<div></div>").addClass("overlay").html("Loading&hellip;");
    
    $(containerClass).prepend(overlay);
}

/************************************************************************
 * Retrieves API data
 *
 * returns: Parsed JSON dataset
 * 
 * endpoint: the API endpoint
 * options: object containing options for the API call
 * callbackFunction: function to execute with a successful request
 ************************************************************************/
function getData(endpoint, options, callbackFunction) {
    //Setup variables
    var apiDomain = "http://ign-apis.herokuapp.com/";
    var defaults = {
        startIndex: 0,
        count: 10,
    };

    //Get Options
    options = $.extend("", defaults, options);

    //Create apiUrl
    var apiUrl = apiDomain + endpoint;

    //Make API call
    //Use JSONP to handle cross-origin request
    var jqxhr = $.ajax({
        type: 'GET',
        url: apiUrl,
        data: options,
        contentType: 'application/json',
        dataType: 'jsonp'
    })
    .done(function(wrapper) {
        //Check that a callbackFunction was defined
        if (callbackFunction !== undefined) {
            callbackFunction(wrapper.data);
        }
    })
    .fail(function(jqxhr, textStatus, error) {
        //Log Error
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });
}

/************************************************************************
 * Displays Article data
 *
 * data: JSON dataset with article data
 *
 *
 * Sample dataset: 
 *  {
 *      "thumbnail": "http://assets1.ignimgs.com/2015/07/12/arrow0711151280jpg-1b4043_compact.jpg",
 *      "metadata": {
 *          "headline": "Arrow Producers and Cast Discuss 'Devastating' Character Death",
 *          "networks": ["ign"],
 *          "state": "published",
 *          "slug": "arrow-producers-and-cast-discuss-devastating-character-death",
 *          "subHeadline": "Team Arrow says goodbye to one of their own.",
 *          "publishDate": "2016-04-07T01:00:35+0000",
 *          "articleType": "article"
 *      }
 *  }
 ************************************************************************/
function displayArticles(data) {
    var articleContainer = ".articles";

    //Clear container
    $(articleContainer).children().remove();

    //Show current range
    var range = $("<div></div>").html("Articles " + (articlesIndex + 1) + " to " + (articlesIndex + data.length));
    $(articleContainer).append(range);

    //Loop through each article and display it
    $(data).each(function(i) {
        var article = createDataRow(
            "article",
            data[i].thumbnail,
            data[i].metadata.headline,
            data[i].metadata.subHeadline
        );

        //Add article to container
        $(articleContainer).append(article);
    });

    //Set New Index
    articlesIndex += data.length;
}

/************************************************************************
 * Displays Video data
 *
 * data: JSON dataset with video data
 *
 *
 * Sample dataset: 
 *  {
 *      "thumbnail": "http://i2.neon-images.com/v1/client/2089095449/neonvid_26f60c2482330982565f3868a0d3a88d.jpg?width=306\u0026height=172",
 *      "metadata": {
 *          "name": "Tom Clancy's The Division Official Operation ISAC Teaser Trailer",
 *          "description": "Weekly assignments are coming to the online shooter. ",
 *          "publishDate": "2016-04-06T15:38:00+0000",
 *          "title": "Tom Clancy's The Division Official Operation ISAC Teaser Trailer",
 *          "longTitle": "Tom Clancy's The Division Official Operation ISAC Teaser Trailer",
 *          "duration": 41,
 *          "url": "http://www.ign.com/videos/2016/04/06/tom-clancys-the-division-official-operation-isac-teaser-trailer",
 *          "slug": "tom-clancys-the-division-official-operation-isac-teaser-trailer",
 *          "ageGate": "17",
 *          "classification": "Trailer",
 *          "subClassification": "none",
 *          "networks": ["ign"],
 *          "state": "published",
 *          "noads": false,
 *          "prime": false,
 *          "subscription": false,
 *          "downloadable": false,
 *          "origin": "Provided",
 *          "genre": "Gaming"
 *      },
 *      "objectRelations": [{
 *          "commonName": "The Division",
 *          "objectName": "Tom Clancy's The Division",
 *          "legacyId": "20000612",
 *          "platform": "Xbox One",
 *          "objectType": "games"
 *      }, {
 *          "commonName": "The Division",
 *          "objectName": "Tom Clancy's The Division",
 *          "legacyId": "20000611",
 *          "platform": "PlayStation 4",
 *          "objectType": "games"
 *      }, {
 *          "commonName": "The Division",
 *          "objectName": "Tom Clancy's The Division",
 *          "legacyId": "20004178",
 *          "platform": "PC",
 *          "objectType": "games"
 *      }]
 *  }
 ************************************************************************/
function displayVideos(data) {
    var videoContainer = ".videos";

    //Clear container
    $(videoContainer).children().remove();

    //Show current range
    var range = $("<div></div>").html("Videos " + (videosIndex + 1)  + " to " + (videosIndex + data.length));
    $(videoContainer).append(range);

    //Loop through each video and display it
    $(data).each(function(i) {
        var video = createDataRow(
            "video",
            data[i].thumbnail,
            data[i].metadata.name,
            data[i].metadata.description
        );

        //Add video to container
        $(videoContainer).append(video);
    });

    //Set New Index
    videosIndex += data.length;
}

/************************************************************************
 * Creates a data row for display
 *
 * returns: An HTML object representing the row of data
 * 
 * className: the class name to give the data row
 * imgSrc: the URL to the thumbnail for the data row
 * headline: the text to display in the headline
 * subheadline: the text to display in the subheadline
 ************************************************************************/
function createDataRow(className, imgSrc, headline, subheadline) {
    var datarow = $("<div></div>").addClass(className);

    //Create Image
    var img = $("<img />").addClass("thumbnail").attr("src", imgSrc);
    datarow.append(img);

    //Create headlines container
    var headlines = $("<div></div>").addClass("headlines");

    //Create Headline
    var headline = $("<div></div>").addClass("headline").html(headline);
    headlines.append(headline);

    //Create Subheadline
    var subheadline = $("<div></div>").addClass("subheadline").html(subheadline);
    headlines.append(subheadline);

    //Add headlines to datarow
    datarow.append(headlines);

    return datarow;
}