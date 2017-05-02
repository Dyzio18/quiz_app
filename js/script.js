'use strict';

(function(){

    const data = {
        urlJSON: "https://cdn.rawgit.com/kdzwinel/cd08d08002995675f10d065985257416/raw/811ad96a0567648ff858b4f14d0096ba241f28ef/quiz-data.json",
        welcomeMsg: 'Weź udział w quizie i odpowiedz na pytania. Pokaż że jesteś geniuszem, ale uważaj czas szybko leci.<br> Powodzenia!', 
        clicked: false, 
        checked: false,
        countQuery: -1,
        userScore: 0,
        numberOfQuery: 0,
        timeInSec:0
    };

  /** Show current view
  */
  const handleView = () => {
    if (data.countQuery < data.numberOfQuery - 1) {
      data.countQuery++;
      showQuery(queryDiv, quiz.questions[data.countQuery].question);
      showAnswer(answerParentDiv, quiz.questions[data.countQuery].answers, data.checked);
      updateProgress(progressDiv, data.countQuery + 1, data.numberOfQuery);
    } else {
      const questionBox = document.getElementById('id__questionBox');

      if (!data.checked) {
        document.getElementById('id__timer').remove();
      }

      data.clicked = false;
      data.checked = true;
      data.countQuery = -1; // Restart counter
      btnNext.innerHTML = 'Sprawdź odpowiedzi';

      showStats(answerParentDiv, questionBox, data.userScore, data.numberOfQuery);
    }
  };

  /** Timer Function (countdown/critical time/stop game)
  *  @param: {number} - time (eg. read from JSON file)
  *                  !default - number of questions multipled by 30 sec.
  */
  const timer = (time = data.numberOfQuery * 30) => {
    const timer = document.getElementById("id__timer");
    let currTime = time;
    const criticalTime = 30 // Signal the end of time (default 30 sec.)
    const interval = setInterval(() => {
      currTime--;
      timer.innerHTML = currTime;

      if (currTime <= criticalTime) {
        timer.className = 'sg-text-bit  sg-text-bit--not-responsive sg-text-bit--small  quiz__text--warning';
      }

      if (currTime === 0) {
        clearInterval(interval);
        data.countQuery = data.numberOfQuery;
        handleView();
      }
    }, 1000);
  };

  /**
  *   @param: {object} - element - DOM element
  *   @param: {string array}- list
  *   @param: {boleans} - check
  */
  const showAnswer = (element, list, check) => {
    let msg = "";
    list.forEach((element, i) => {
      if (check && list[i].correct) {
        msg = `${msg}<p class="quiz__answer quiz__answer--correct" data-answer="${list[i].id}">${list[i].answer} </p>`
      } else {
        msg = `${msg}<p class="quiz__answer" data-answer="${list[i].id}" >${list[i].answer}</p>`;
      }
    });

    element.innerHTML = msg;
  };

  /**
  *   @param: {number} - id_answer
  *   @param: {string array} - list
  */
  const checkAnswer = (id_answer, list) => list[id_answer].correct;

  /**  Create question in view
  *   @param: {object} - element - DOM element
  *   @param: {string} - str
  */
  const showQuery = (element, str) => {
    element.innerHTML = str;
  };

  /** Show statistic in final screen
  *   @param: {object} - element1 - DOM element (output)
  *   @param: {object} - element2 - DOM element
  *   @param: {number} - score
  *   @param: {number} - maxNum
  */
  const showStats = (element1, element2, score, maxNum) => {
    element1.innerHTML = `<h1 class="sg-text-bit sg-text-bit--not-responsive sg-text-bit--warning quiz__text--center"> Twój wynik: ${score}/${maxNum}</h1>`;
    element2.style.display = 'none';
  }

  /** Read file from URL and return data
  *   @param:  {url} - urlJSON
  *   @return: {object} or {false}(error)
  */
  const readFile = (urlJSON) => {
    const xhr = new XMLHttpRequest();
    let data;

    xhr.overrideMimeType('application/json');
    xhr.open('GET', urlJSON, false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status == '200') {
        data = xhr.responseText;
      } else {
        console.log(`Error ${xhr.statusText}`);
        data = false;
      }
    };

    xhr.send();

    return data;
  };

  /** Function show progress in game (left-bottom div in footer)
  *   @param:  {object} - element - DOM element
  *   @param:  {number} - counter
  *   @param:  {number} - maxNum
  */
  const updateProgress = (element, counter, maxNum) => {
    let msg = `${counter}/${maxNum}`;
    element.innerHTML = msg;
  };


    const quizData = readFile(data.urlJSON);
    if(!quizData)
    {
        console.log("Error cannot read JSON file");
        return;
    }
    const quiz = JSON.parse(quizData);
    data.numberOfQuery = quiz.questions.length;
    data.timeInSec = quiz.time_seconds;


    const queryDiv = document.getElementById('id__questions');
    const answerParentDiv = document.getElementById("id__answers");
    const progressDiv = document.getElementById("id__progress");
    const btnNext = document.getElementById("id__buttonNext");   

    // Welcome screen 
    showQuery (queryDiv, data.welcomeMsg);
    document.getElementById("id__timer").innerHTML = data.timeInSec;
    updateProgress(progressDiv,data.countQuery+1,data.numberOfQuery);
  
    // Button events
    btnNext.addEventListener('click',(e)=> {
        if(!data.clicked) {
            data.clicked = true;
            btnNext.innerHTML = "Dalej";          
            if( !data.checked){ timer(data.timeInSec); } 
            else{ document.getElementById("id__questionBox").style.display = 'block'; }
        }  
        handleView();
    })

    // Answers event
    answerParentDiv.addEventListener('click', function(e){
        if(e.target.className === "quiz__answer"){
            data.userScore += checkAnswer(e.target.getAttribute("data-answer")-1, quiz.questions[data.countQuery].answers );
            handleView();
        }
    }) 
})();