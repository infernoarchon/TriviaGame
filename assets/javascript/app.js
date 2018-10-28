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
    $(document).on("click", ".incorrectans", timer.stop);
    $(document).on("click", ".correctans", timer.stopcorr);
};

// Global Variables
var gamestarted = false
var correctq = 0
var incorrectq = 0

var intervalId;
var clockRunning = false;

var currentcategory;
var questions;
var currentq = 0;

var answerorder = [0,1,2,3];
var ansslot1;
var ansslot2;
var ansslot3;
var ansslot4;

var correctcount=0;
var incorrectcount=0;
var unansweredcount=0;

var categories = {
    "General": {
        "id":"9",
        "difficulty":"easy"
    },
    "Books": {
        "id":"10",
        "difficulty":"hard"
    },
    "Film": {
        "id":"11",
        "difficulty":"medium"
    },
    "Music": {
        "id":"12",
        "difficulty":"hard"
    },
    "Television": {
        "id":"14",
        "difficulty":"medium"
    },
    "Video Games": {
        "id":"15",
        "difficulty":"medium"
    },
    "Science": {
        "id":"17",
        "difficulty":"hard"
    },
    "Sports": {
        "id":"21",
        "difficulty":"medium"
    },
    "History": {
        "id":"23",
        "difficulty":"easy"
    }
}


var timer = {
    time: 30,
    bartime: 300,
    start: function() {
        if (!clockRunning) {
        intervalId = setInterval(timer.count, 1000)
        barintervalId = setInterval(timer.barcount, 100)
        clockRunning = true;
        }
    },
    reset: function() {
        if(currentq === 9) {
            timer.permstop()
        }
        if(currentq < 9) {
            trivia.cleanup()
            currentq++
            trivia.printq(currentq)
            timer.time = 30
            timer.bartime = 300
            $("#displayTimer").html("30")
            timer.start()
        }
    },
    count: function() {
        timer.time--
        var countTime = timer.timeConverter(timer.time)
        $("#displayTimer").html(countTime)
        if(timer.time===0) {
            unansweredcount++
            clearInterval(intervalId);
            clearInterval(barintervalId);
            clockRunning = false;
            $(".correctans").addClass("list-group-item-success")
            $(".list-group-item").removeClass("has-hover")
            $(document).off("click")
            setTimeout(timer.reset,5000)
        }
    },
    barcount: function() {
        timer.bartime--
        var barlength = timer.bartime
        $("#timerbarprogress").attr("style","width:"+barlength/3+"%")
    },
    stop: function() {
        incorrectcount++
        clearInterval(intervalId);
        clearInterval(barintervalId);
        clockRunning = false;
        $(".correctans").addClass("list-group-item-success")
        $(".list-group-item").removeClass("has-hover")
        $(this).addClass("list-group-item-danger")
        $(document).off("click")
        setTimeout(timer.reset,5000)
    },
    stopcorr: function() {
        correctcount++
        clearInterval(intervalId);
        clearInterval(barintervalId);
        clockRunning = false;
        $(".correctans").addClass("list-group-item-success")
        $(".list-group-item").removeClass("has-hover")
        $(document).off("click")
        setTimeout(timer.reset,5000)
    },
    permstop: function() {
        clearInterval(intervalId);
        clearInterval(barintervalId);
        clockRunning = false;
        $("#answer-view").addClass("invisible")
        $("#timer-area-grab").addClass("invisible")
        $("#result-view").removeClass("invisible")
        $("#question-view").text("All done, here's how you did!")
        $("#question-view").addClass("text-center")
        $("#question-view").removeClass("font-weight-bold")
        $("#playagain").on("click", trivia.restart)
        $("#correct-view").text(correctcount)
        $("#incorrect-view").text(incorrectcount)
        $("#unanswered-view").text(unansweredcount)
        if(correctcount < 6) {
            var p = $("<p>")
            p.text("Looks like The Riddler got away. Better luck next time!")
            $("#riddlerresult").append(p)
        } else {
            var p = $("<p>")
            p.text("You've caught The Riddler! His questions were no match for you!")
            $("#riddlerresult").append(p)
        }


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
        $(".timer-area").removeClass("invisible")
        console.log("starts the game")
    },
    end: function() {
        gamestarted = false
        trivia.cleanup()
    },
    restart: function() {
        location.reload()
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
        ansslot1 = "ans" + a[0]
        ansslot2 = "ans" + a[1]
        ansslot3 = "ans" + a[2]
        ansslot4 = "ans" + a[3]
        $("#" + ansslot1).html(questions.results[y].correct_answer)
        $("#" + ansslot1).addClass("correctans")
        $("#" + ansslot2).html(questions.results[y].incorrect_answers[0])
        $("#" + ansslot2).addClass("incorrectans");
        $("#" + ansslot3).html(questions.results[y].incorrect_answers[1])
        $("#" + ansslot3).addClass("incorrectans");
        $("#" + ansslot4).html(questions.results[y].incorrect_answers[2])
        $("#" + ansslot4).addClass("incorrectans");
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
            trivia.printq(currentq)
        });
    },
    cleanup : function() {
        $("#" + ansslot1).removeClass("incorrectans correctans list-group-item-danger list-group-item-success");
        $("#" + ansslot2).removeClass("incorrectans correctans list-group-item-danger list-group-item-success");
        $("#" + ansslot3).removeClass("incorrectans correctans list-group-item-danger list-group-item-success");
        $("#" + ansslot4).removeClass("incorrectans correctans list-group-item-danger list-group-item-success");
        $(document).on("click", ".incorrectans", timer.stop);
        $(document).on("click", ".correctans", timer.stopcorr);
        $(".list-group-item").addClass("has-hover");
    },
    categories : function() {
        for (var i = 0; i < Object.keys(categories).length; i++) {
            currentcategory = Object.keys(categories)[i]
            // Then dynamicaly generating buttons
            var a = $("<a href='#'>");
            // Adding a class to our button
            a.addClass("category btn btn-outline-light col-4 rounded-0 text-uppercase");
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
