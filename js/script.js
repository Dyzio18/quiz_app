/* JavaScript Quiz
 * version 0.1.2
 * http://patryk-nizio.pl/
 * created by: Patryk Nizio @dyzio
 */

(function(){

    const urlJSON = "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json" 
    let qData = readFile(urlJSON);

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
    let countQuery = -1;
    // Current user score
    let userScore = 0;
 
    // Welcome screen 
    let msg = 'Weź udział w quizie i odpowiedz na pytania. Pokaż że jesteś geniuszem, ale uważaj czas szybko leci.<br> Powodzenia!';
    showQuestion (queryDiv, msg);
    document.getElementById("id__timer").innerHTML = timeSec;
    updateProgress(progressDiv,countQuery+1,numQuery);

    let clicked = false;
    let checked = false;
    const btnNext = document.getElementById("id__buttonNext");
   
    btnNext.addEventListener('click',(e)=> {
        if(!clicked) {
            clicked = true;
            btnNext.innerHTML = "Dalej";
            
            if(!checked){
                timer(timeSec);
            } else{
                document.getElementById("id__questionBox").style.display = 'block';               
            }
        }  
        handleView();
    })

    answerParentDiv.addEventListener('click', function(e){
        if(e.target.className === "quiz__answer"){
            userScore += checkAnswer(e.target.getAttribute("data-answer")-1, quizData.questions[countQuery].answers );
            handleView();
        }
    }) 

/* Show current view
*/
const handleView  = function handleView(){
    // If questions to ask
    if( countQuery < numQuery -1 ){        
        countQuery++;  
        showQuestion(queryDiv, quizData.questions[countQuery].question);
        showAnswer(answerParentDiv, quizData.questions[countQuery].answers, checked); 
        updateProgress(progressDiv,countQuery+1,numQuery);
    }
    // End of questions
    else {
        if(!checked){
            let timer = document.getElementById("id__timer").remove();
        }
        clicked = false;
        checked = true;
        countQuery = -1; // Restart counter

        btnNext.innerHTML = "Sprawdź odpowiedzi";
        let questionBox = document.getElementById("id__questionBox");
        showStats (answerParentDiv,questionBox, userScore, numQuery);
    }
}

/*  Timer Function (countdown/critical time/stop game)
*   @param: {number} - time (eg. read from JSON file)
*                  !default - number of questions multipled by 30 sec.
*/
const timer = function timer(time = numQuery*30 ){ 
    let timer = document.getElementById("id__timer");
    let tm = time;
    let criticalTime = 30 // Signal the end of time (default 30 sec.)
    let interval = setInterval(function() {
        tm--;
        timer.innerHTML = tm;
        if ( tm <= criticalTime ){
            timer.className = "sg-text-bit  sg-text-bit--not-responsive sg-text-bit--small  quiz__text--warning";
        }
        if (tm === 0 ){
            clearInterval(interval);
            countQuery = numQuery;
            handleView();
            return;    
        }
    }, 1000);
}
})();

/*
*   @param: {DOM string} - element
*   @param: {string array}- list
*   @param: {boleans} - check
*/
function showAnswer (element, list, check) {
    let msg = "";
    list.forEach( function(e,i){
        if(check) {
            if(list[i].correct){
                msg += `<p class="quiz__answer quiz__answer--correct" data-answer="${list[i].id}" >${list[i].answer}</p>`;
            } else {
                msg += `<p class="quiz__answer" data-answer="${list[i].id}" >${list[i].answer}</p>`;
            }
        } else{
            msg += `<p class="quiz__answer" data-answer="${list[i].id}" >${list[i].answer}</p>`;
        }
    })
    element.innerHTML = msg;
}

/* 
*   @param: {number} - id_answer 
*   @param: {string array} - list
*/
function checkAnswer (id_answer, list) {
    return list[id_answer].correct
}

/*  Create question in view
*   @param: {DOM string} - element 
*   @param: {string} - str
*/
function showQuestion (element,  str) {
    element.innerHTML = str;    
}

/* Show statistic in final screen
*   @param: {DOM string} - element1 (output)
*   @param: {DOM string} - element2
*   @param: {number} - score 
*   @param: {number} - maxNum
*/
function showStats (element1, element2, score, maxNum) {
    element1.innerHTML = `<h1 class="sg-text-bit sg-text-bit--not-responsive sg-text-bit--warning quiz__text--center"> Twój wynik: ${score}/${maxNum}</h1>`;
    element2.style.display = 'none';
}

/*  Read file from URL and return data
*   @param:  {url adrress} - file
*   @return: {DOM string} or {false}(error)
*/
function readFile (urlJSON) {
    let xhr = new XMLHttpRequest();
    let data;
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
*   @param:  {DOM string} - element
*   @param:  {number} - counter
*   @param:  {number} - maxNum 
*/
function updateProgress(element, counter, maxNum){
    let msg = `${counter}/${maxNum}`;
    element.innerHTML = msg;
}