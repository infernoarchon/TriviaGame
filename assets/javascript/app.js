// Intro screen with start
// Start the timer
// Get question
    //Get question type
    //Get question value
// Get answers

window.onload = function() {
    trivia.categories()
    // Put click events here
    $(document).on("click", ".category", trivia.getq);
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
var currentcategory;
var questions;
var answerorder = [0,1,2,3];

var categories = {
    "General": {
        "id":"9",
        "difficulty":"medium"
    },
    "Books": {
        "id":"10",
        "difficulty":"medium"
    },
    "Film": {
        "id":"11",
        "difficulty":"easy"
    },
    "Music": {
        "id":"12",
        "difficulty":"medium"
    },
    "Television": {
        "id":"14",
        "difficulty":"medium"
    },
    "Video Games": {
        "id":"15",
        "difficulty":"hard"
    },
    "Science": {
        "id":"17",
        "difficulty":"medium"
    },
    "Sports": {
        "id":"21",
        "difficulty":"easy"
    },
    "Comics": {
        "id":"29",
        "difficulty":"medium"
    }
}


var timer = {
    time: 30,
    start: function() {
        intervalId = setInterval(timer.count, 1000)
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
        timer.start()
        $("#intro-pic").addClass("invisible")
        $("#intro-title").addClass("invisible")
        $("#categories").addClass("invisible")
        $("#question-view").addClass("font-weight-bold")
        $("#question-view").text("")
        $("#answer-view").removeClass("invisible")
        console.log("starts the game")
    },
    end: function() {
        gamestarted = false
        trivia.cleanup()
    },
    printq: function(x) {
        $("#question-view").html(questions.results[x].question)
        trivia.shuffle(answerorder)
        trivia.fillans(answerorder, x)
    },
    shuffle: function(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },
    fillans: function(a, y) {
        var ansslot1 = "ans" + a[0]
        var ansslot2 = "ans" + a[1]
        var ansslot3 = "ans" + a[2]
        var ansslot4 = "ans" + a[3]
        $("#" + ansslot1).html(questions.results[y].correct_answer)
        $("#" + ansslot1).attr("data-name", "correctans");
        $("#" + ansslot1).addClass("font-weight-bold");
        $("#" + ansslot2).html(questions.results[y].incorrect_answers[0])
        $("#" + ansslot2).attr("data-name", "incorrectans");
        $("#" + ansslot3).html(questions.results[y].incorrect_answers[1])
        $("#" + ansslot3).attr("data-name", "incorrectans");
        $("#" + ansslot4).html(questions.results[y].incorrect_answers[2])
        $("#" + ansslot4).attr("data-name", "incorrectans");
    },
    getq : function() {
        trivia.start()
        var categorychoice = $(this).attr("data-name");
        var categorydiff = categories[categorychoice].difficulty
        var categoryid = categories[categorychoice].id
        var triviaqueryURL = "https://opentdb.com/api.php?amount=10&category=" + categoryid + "&difficulty=" + categorydiff + "&type=multiple"
        $.ajax({
            url: triviaqueryURL,
            method: "GET"
        }).then(function(response) {
            questions = response
            console.log(response)
            trivia.printq(0)
        });
    },
    cleanup : function() {
        console.log("cleans up stuff")
    },
    categories : function() {
        for (var i = 0; i < Object.keys(categories).length; i++) {
            currentcategory = Object.keys(categories)[i]
            // Then dynamicaly generating buttons
            var a = $("<a href='#'>");
            // Adding a class to our button
            a.addClass("category btn btn-outline-secondary col-4 rounded-0 ");
            // Adding a data-attribute
            a.attr("data-name", currentcategory);
            // Providing the initial button text
            a.text(currentcategory);
            // Adding the button
            $("#categories").append(a);
        }
    },
    hideintro: function() {
        $("#intropic").addClass("invisible")
    }


}
