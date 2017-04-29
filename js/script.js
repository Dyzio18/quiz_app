/* JavaScript Quiz
 * version 0.1.0
 * http://patryk-nizio.pl/
 * created by: Patryk Nizio @dyzio
 */

/* TODO:
    [ ] Timer, dodac zegar, + animacja gdy koncowka  

    optionnal [] RestartGame()
*/


(function(){

    const urlJSON = "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json" 
    var qData = readFile(urlJSON);

    if(!qData)
    {
        console.log("Error cannot read JSON file");
        return;
    }
    const quizData = JSON.parse(qData);

    const queryDiv = document.getElementById('id__questions');
    const answerParentDiv = document.getElementById("id__answers");
    const progressDiv = document.getElementById("id__progress");

    // Number of questions 
    const numQuery = quizData.questions.length;
    // Time in secnds 
    const timeSec = quizData.time_seconds;
    // Current question counter
    var countQuery = -1;
    // Current user score
    var userScore = 0;
 
    var msg = "Witaj! Weź udział w quizie i odpowiedz na pytania. Pokaż że jesteś geniuszem, ale uważaj czas szybko leci. Powodzenia!"
    showQuestion (queryDiv, msg);
    document.getElementById("id__timer").innerHTML = timeSec;

    updateProgress(progressDiv,countQuery+1,numQuery);

    var clicked = false;
    const btnNext = document.getElementById("id__buttonNext");
    btnNext.addEventListener('click',(e)=> {
        if(!clicked) {
            clicked = true;
            btnNext.innerHTML = "Dalej";
            timer(timeSec,true);

        }      
        handleView();
    })

    answerParentDiv.addEventListener('click', function(e){
        if(e.target.className === "quiz__answer"){
            userScore += checkAnswer(e.target.getAttribute("data-answer")-1, quizData.questions[countQuery].answers );
            console.log(userScore);
            handleView();
        }
    }) 

    function handleView(){
        if( countQuery < numQuery -1 ){
            countQuery++;  
            showQuestion(queryDiv, quizData.questions[countQuery].question);
            showAnswer(answerParentDiv, quizData.questions[countQuery].answers); 
            updateProgress(progressDiv,countQuery+1,numQuery);
        }
        else {
            var timer = document.getElementById("id__timer").remove(); //!!!

            btnNext.remove();
            var questionBox = document.getElementById("id__questionBox");
            showStats (answerParentDiv,questionBox, userScore, numQuery);
        }
    }
})();

/*
*   @param: element - DOM string
*   @param: list - string array
*/
function showAnswer (element, list) {
    var msg = "";
    for(var i = 0; i < list.length; i++){
        msg += '<p class="quiz__answer" data-answer="'+list[i].id+'" >'+list[i].answer+'</p>';
    }
    element.innerHTML = msg;
}

/* 
*   @param: id_answer - number
*   @param: list - string array
*/
function checkAnswer (id_answer, list) {
    if(list[id_answer].correct){
        return 1;
    }  
    return 0;
}

/*  Create question in view
*   @param: element - DOM string
*   @param: str - string
*/
function showQuestion (element,  str) {
    element.innerHTML = str;    
}

function showStats (element1, element2, score, maxNum) {
    element1.innerHTML = '<h1 class="sg-text-bit sg-text-bit--not-responsive sg-text-bit--warning"> Twój wynik: '+score+'</h1>';
    element2.style.display = 'none';
}

/*  Read file from URL and return data
*   @param: file - url adrress
*   @return: DOM string or false(error)
*/
function readFile (urlJSON) {
    var xhr = new XMLHttpRequest();
    var data;
    xhr.overrideMimeType("application/json");
    xhr.open("GET", urlJSON, false); // Synchronic read file, important data for run app  
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 )
            // File load correct
            if( xhr.status == "200") {
               data = xhr.responseText;
            }
            // Handling of file loading error
            else{
                console.log("Error"+xhr.statusText);
                data = false;
            }
        }
    xhr.send()
    return data;
}
 
/*  Function show progress in game (left-bottom div in footer)
*   @param: element - DOM string
*   @param: counter - number
*   @param: maxNum - number
*/
function updateProgress(element, counter, maxNum){
    var msg = counter+"/"+maxNum;
    element.innerHTML = msg;
}

/*  
*   @param: time - number (read from JSON file)
*/
function timer(time = 0, play = false){
    var timer = document.getElementById("id__timer");
    var tm = time;
    console.log(time);
    var interval = setInterval(function() {
        tm--;
        timer.innerHTML = tm;
        if (tm === 0 ){
            clearInterval(interval);
            return;    
        } 
    }, 1000);    //TODO 
}

