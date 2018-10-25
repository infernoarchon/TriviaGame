// Intro screen with start
// Start the timer
// Get question
    //Get question type
    //Get question value
// Get answers

window.onload = function() {
    // Put click events here
    $("#start-btn").on("click", function() {
        trivia.start()
        timer.start()
    });
};

// Global Variables
var gamestarted = false
var correctq = 0
var incorrectq = 0

var firstanswer;
var secondanswer;
var thirdanswer;
var fourthanswer;

var intervalId;

var qarray = ["Washington", "Karate Kid", "Count Chocula"]
var question = []
var used = []
var querURL = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=jsonfm&formatversion=2&titles=Magic%20Mike"

var timer = {
    time: 30,
    start: function() {
        intervalId = setInterval(timer.count, 1000);
    },
    reset: function() {
        timer.time = 30
        $("#displayTimer").html("30")
        timer.start()
    },
    count: function() {
        timer.time--
        var countTime = timer.timeConverter(timer.time)
        $("#displayTimer").html(countTime)
        if(timer.time===0) {
            console.log("Time Up! The answer was blah blah")
            timer.stop()
            setTimeout(timer.reset,5000)
        }
    },
    stop: function() {
        clearInterval(intervalId);
    },
    timeConverter: function(t) {
        //  Takes the current time in milliseconds and convert it to seconds
        var seconds = Math.floor(t);
        return seconds
    }
}
var trivia = {
    start : function() {
        gamestarted = true

        console.log("starts the game")
    },
    end: function() {
        gamestarted = false
        trivia.cleanup()
    },
    getq : function() {
        console.log("gets the question")
    },
    getdata: function(x) {
        console.log("gets data for question based on random id x and logs it into used questions array")
    },
    parsequestion: function(x) {
        console.log("removes the page title from the description")
    },
    cleanup : function() {
        console.log("cleans up stuff")
    }

}