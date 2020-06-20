import { testQuestionData } from './sampleData.js';

function sortRandom(array) {
  array.sort((a, b) => 0.5 - Math.random());
  return array;
}

function validateInput() {
  let inputName = getElement(`input`).getAttribute('name');
  let inputChecked = getElement(`input[name= "${inputName}"]:checked`);
  if (inputChecked) {
    return true;
  } else {
    return false;
  }
}

function generateQuestions(dataObj) {
  var questions = [];
  for (let data in dataObj) {
    questions.push(data);
  }
  return questions;
}

function flushQContainer(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function paginationCheck(pagination) {
  if (pagination == randomizedQArray.length - 1) {
    determinate.classList.add('red', 'accent-4');
    return true;
  }
  return false;
}

function populateQContainer(element, pagination) {
  var questionKey = randomizedQArray[pagination];
  var currentQuestionProp = testQuestionData[questionKey];
  var inputType = currentQuestionProp.multipleAnswer ? 'checkbox' : 'radio';
  var imgAvailable = currentQuestionProp.imageDIR ? true : false;
  var newH4 = document.createElement('h4');
  var imageQuestionMsg = imgAvailable
    ? `
    Please refer to the exhibit below. <br><br>
    <img class="responsive-img" alt="question related image" src="${currentQuestionProp.imageDIR}"> 
  `
    : '';
  newH4.innerHTML = `
    Question ${pagination + 1}: ${imageQuestionMsg}
    ${questionKey}?
  `;
  element.appendChild(newH4);
  var choices = currentQuestionProp.choices;

  for (var i = 0; i < choices.length; i++) {
    var newP = document.createElement('p');
    var newLabel = document.createElement('label');
    var newInput = document.createElement('input');
    var newSpan = document.createElement('span');
    newSpan.innerHTML = choices[i];
    newInput.setAttribute('type', inputType);
    newInput.setAttribute('name', `question`);
    newInput.setAttribute('value', `${choices[i]}`);
    newInput.classList.add('with-gap');
    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);
    newP.appendChild(newLabel);
    element.appendChild(newP);
  }
  if (pagination > currentMax) {
    currentMax = pagination;
    let currentProgress = (currentMax + 1) * progressScale;
    determinate.style.width = `${currentProgress}%`;
  }
}

function preLoader() {
  restart.classList.add('disabled');
  quit.classList.add('disabled');
  continueButton.classList.add('disabled');
  modalMsg.innerHTML = `
    <h4 class="center">Loading Results</h4>
    <br>
    <div class="row">
      <div class="col s12 m4 l4"></div>
      <div class="col s12 m4 l4">
      <div class="preloader-wrapper big active">
      <div class="spinner-layer  spinner-blue">
        <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-red">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-yellow">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-green">
      <div class="circle-clipper left">
        <div class="circle"></div>
        </div><div class="gap-patch">
        <div class="circle"></div>
        </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>        
  
      </div>
      <div class="col s12 m4 l4"></div>
    </div>
  `;
}

function roundToHundredths(num) {
  let hundredths = Math.pow(10, -2);
  num /= hundredths;
  return Number(Math.round(num) * hundredths).toFixed(2);
}
function calculateResults(correctAnswers) {
  var results = roundToHundredths((correctAnswers / numberOfQuestions) * 100);
  return results;
}

function getAnswer() {
  const inputs = getElements('input');
  var answersArray = [];
  for (let input of inputs) {
    if (input.checked) {
      answersArray.push(input.value);
    }
  }
  return answersArray;
}

function processAnswers(answers, currentQuestion) {
  if (answers.length == currentQuestion.correct.length) {
    for (let answer of answers) {
      if (currentQuestion.correct.includes(answer)) {
        continue;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
}

function showAlert(alert, currentQuestion) {
  switch (alert) {
    case 'correct':
      M.toast({
        html: `<span class="bold">Correct. </span>`,
        classes: 'green accent-3',
        displayLength: 1000,
      });
      break;
    case 'incorrect':
      M.toast({
        html: `<span class="bold">Incorrect. <br><br>Correct Answer: ${currentQuestion.correct}</span>`,
        classes: 'red',
      });
      break;
    case 'invalid':
      M.toast({ html: 'Please Answer!', classes: 'red', displayLength: 1000 });
      break;
  }
}

function checkAnswer(answer, pagination) {
  var questionKey = randomizedQArray[pagination];
  var currentQuestionProp = testQuestionData[questionKey];
  var correct = false;
  if (currentQuestionProp.multipleAnswer) {
    correct = processAnswers(answer, currentQuestionProp);
    if (correct) {
      correctAnswers += 1;
      showAlert('correct', currentQuestionProp);
    } else {
      showAlert('incorrect', currentQuestionProp);
      incorrectlyAnsweredQuestions.push(questionKey);
    }
  } else {
    correct = answer[0] == currentQuestionProp.correct;
    if (correct) {
      correctAnswers += 1;
      showAlert('correct', currentQuestionProp);
    } else {
      showAlert('incorrect', currentQuestionProp);
      incorrectlyAnsweredQuestions.push(questionKey);
    }
  }
}

function showResults(res) {
  restart.classList.remove('disabled');
  quit.classList.remove('disabled');
  if (res != 100) {
    continueButton.classList.remove('disabled');
  }
  modalMsg.innerHTML = `
    <div class="center">
      <h4>Results</h4>
      <h5> Your have a grade of ${res}%</h5>
    </div>
  `;
}

function pulseOnChecked(button) {
  const inputs = getElements(`input[name="question"]`);
  inputs.forEach((input) => {
    input.addEventListener('click', (e) => {
      if (e.target.checked) {
        button.classList.add('pulse', 'btn-large', 'orange', 'darken-1');
      }
    });
  });
}

function getElement(s) {
  return document.querySelector(s);
}

function getElements(s) {
  return document.querySelectorAll(s);
}

// selected elements
const questionContainer = getElement('.questions');
const next = getElement('.next');
const submit = getElement('.submit');
const buttonContainer = getElement('.buttonContainer');
const modalMsg = getElement('.modalMsg');
const determinate = getElement('.determinate');
const modal = getElement('.modal');
const restart = getElement('.restart');
const quit = getElement('.quit');
const continueButton = getElement('.continue');

// question keys
var questionsArray = generateQuestions(testQuestionData);
// random question keys order
var randomizedQArray = sortRandom(questionsArray);
// populated when user submit answers
var numberOfQuestions = randomizedQArray.length;
var incorrectlyAnsweredQuestions = [];
var pagination = 0;
var currentMax = 0;
var progressScale = Math.ceil(100 / randomizedQArray.length);
var correctAnswers = 0;

// initialize app
populateQContainer(questionContainer, pagination);
var finalQuestion = paginationCheck(pagination);
if (finalQuestion) {
  determinate.classList.add('red', 'accent-4');
  determinate.style.width = `${100}%`;
  submit.classList.toggle('none');
  next.classList.toggle('none');
  pulseOnChecked(submit);
}

// events

// load Materialize contents
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit(modal);
});

next.addEventListener('click', (e) => {
  var answered = validateInput();
  if (answered) {
    var answer = getAnswer();
    checkAnswer(answer, pagination);
    pagination += 1;
    flushQContainer(questionContainer);
    populateQContainer(questionContainer, pagination);
    var finalQuestion = paginationCheck(pagination);
    if (finalQuestion) {
      submit.classList.toggle('none');
      next.classList.toggle('none');
      pulseOnChecked(submit);
    }
  } else {
    showAlert('invalid', null);
  }
});

submit.addEventListener('click', () => {
  var answered = validateInput();
  if (answered) {
    var answer = getAnswer();
    checkAnswer(answer, pagination);
    M.Modal.init(modal, {
      dismissible: false,
    });
    submit.classList.toggle('none');
    next.classList.toggle('none');
    submit.classList.remove('pulse', 'orange', 'darken-1', 'btn-large');
    preLoader();
    window.setTimeout(() => {
      var results = calculateResults(correctAnswers);
      showResults(results);
    }, 5000);
  } else {
    showAlert('invalid', null);
  }
});

restart.addEventListener('click', () => location.reload());
quit.addEventListener('click', () => {
  document.body.style.pointerEvents = 'none';
  next.classList.add('disabled');
  determinate.classList.remove('red', 'accent-4');
  determinate.classList.add('grey');
  questionContainer.innerHTML = `
    <h1 class='center-align'>Final Result: ${calculateResults(
      correctAnswers
    )}%</h1>
  `;
});

continueButton.addEventListener('click', () => {
  randomizedQArray = sortRandom(incorrectlyAnsweredQuestions);
  progressScale = Math.ceil(100 / randomizedQArray.length);
  incorrectlyAnsweredQuestions = [];
  pagination = 0;
  currentMax = 0;
  determinate.classList.remove('red', 'accent-4');
  determinate.style.width = `${0}%`;
  flushQContainer(questionContainer);
  populateQContainer(questionContainer, pagination);
  var finalQuestion = paginationCheck(pagination);
  if (finalQuestion) {
    determinate.classList.add('red', 'accent-4');
    determinate.style.width = `${100}%`;
    submit.classList.toggle('none');
    next.classList.toggle('none');
    pulseOnChecked(submit);
  }
});
