function sortRandom(array) {
  array.sort((a, b) => 0.5 - Math.random());
  return array;
}

function changeNextButton() {
  next.innerHTML = `Submit <i class="material-icons right">send</i>`;
  next.classList.remove('next');
}
function validateRadio() {
  radioName = getElement(`input[type="radio"]`).getAttribute('name');
  radioChecked = getElement(`input[name= "${radioName}"]:checked`);
  if (radioChecked) {
    return radioChecked.value;
  } else {
    return false;
  }
}

function generateQuestions(dataObj) {
  var questions = [];
  for (data in dataObj) {
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

function checkForImage() {
  if (QnAdata[randomizedQArray[pagination]].imageDIR) {
    return true;
  } else {
    return false;
  }
}

function populateQContainer(element, pagination) {
  var questionKey = randomizedQArray[pagination];
  var currentQuestion = QnAdata[questionKey];
  var newH4 = document.createElement('h4');
  var imageQuestionMsg = checkForImage()
    ? `
    Please refer to the image below.
    <img class="materialBoxed responsive-img" src="${currentQuestion.imageDIR}"> 
  `
    : '';
  newH4.innerHTML = `
    Question ${pagination + 1}: ${imageQuestionMsg}
    ${questionKey} 
  `;
  element.appendChild(newH4);
  var choices = currentQuestion.choices;

  for (var i = 0; i < choices.length; i++) {
    var newLabel = document.createElement('label');
    var newRadio = document.createElement('input');
    var newSpan = document.createElement('span');
    newSpan.innerHTML = choices[i];
    newRadio.setAttribute('type', 'radio');
    newRadio.setAttribute('name', `question`);
    newRadio.setAttribute('value', `${choices[i]}`);
    newRadio.required = true;
    newLabel.appendChild(newRadio);
    newLabel.appendChild(newSpan);
    element.appendChild(newLabel);
    // element.appendChild(newRadio);
  }
  if (pagination > currentMax) {
    currentMax = pagination;
    currentProgress = (currentMax + 1) * progressScale;
    determinate.style.width = `${currentProgress}%`;
  }
}

function preLoader() {
  restart.classList.add('disabled');
  quit.classList.add('disabled');
  continueButton.classList.add('disabled');
  modalMsg.innerHTML = `
    <h4 class="center">Loading Results</h4>
    <br/><br/>
    <div class="row center">
      <div class="col s12 m4 l5"></div>
        <div class="col s12 m4 l2">
          <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-blue">
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
      </div>
      <div class="col s12 m4 l5"></div>
    </div>    
  `;
}

function roundToHundredths(num) {
  hundredth = Math.pow(10, -2);
  num /= hundredth;
  return Math.round(num) * hundredth;
}
function calculateResults(correctAnswers) {
  var results = roundToHundredths((correctAnswers / numberOfQuestions) * 100);
  return results;
}

function checkAnswer(answer, pagination) {
  if (answer == QnAdata[randomizedQArray[pagination]].correct) {
    correctAnswers += 1;
    M.toast({
      html: `<span class="bold">Correct. </span>`,
      classes: 'green accent-3',
      displayLength: 1000,
    });
    return true;
  } else {
    M.toast({
      html: `<span class="bold">Incorrect. <br> Correct Answer: ${
        QnAdata[randomizedQArray[pagination]].correct
      }</span>`,
      classes: 'red',
    });
    incorrectlyAnsweredQuestions.push(randomizedQArray[pagination]);
    return false;
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
  const radios = getElements(`input[name="question"]`);
  radios.forEach((radio) => {
    radio.addEventListener('click', (e) => {
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
// keys = questions
// properties = correct answer, choices array.
var QnAdata = {
  '1+1': {
    correct: '2',
    choices: ['1', '2', '3'],
  },
  '5**2': {
    correct: '25',
    choices: ['4', '81', '25'],
  },
  '10^3': {
    correct: '1000',
    choices: ['10', '100', '1000'],
  },
  'Meaning of Life': {
    correct: '42',
    choices: ['42', '69', '96'],
  },
  'Number of The Answer': {
    correct: '3',
    choices: ['3', '23', '8'],
  },
  'This image is taken from what monster hunter game': {
    correct: 'MHP3RD',
    choices: ['MH', 'MHDOS', 'MHF2', 'MHFU', 'MHP3RD', 'MHTRI', 'MH3U'],
    imageDIR: `testImages/mhp3rd.jpg`,
  },
};

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
var questionsArray = generateQuestions(QnAdata);
// random question keys order
var randomizedQArray = sortRandom(questionsArray);
// populated when user submit answers
var numberOfQuestions = randomizedQArray.length;
var incorrectlyAnsweredQuestions = [];
var pagination = 0;
var currentMax = 0;
var progressScale = Math.ceil(100 / randomizedQArray.length);
var correctAnswers = 0;

populateQContainer(questionContainer, pagination);

// events

// load Materialize contents
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit(modal);
});

next.addEventListener('click', (e) => {
  var answer = validateRadio();
  if (answer) {
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
    M.toast({ html: 'Please Answer!', classes: 'red', displayLength: 1000 });
  }
});

submit.addEventListener('click', () => {
  var answer = validateRadio();
  if (answer) {
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
    alert('answer');
  }
});

restart.addEventListener('click', () => location.reload());
quit.addEventListener('click', () => {
  document.body.style.pointerEvents = 'none';
  next.classList.add('disabled');
  determinate.classList.remove('red', 'accent-4');
  determinate.classList.add('grey');
  questionContainer.innerHTML = `
    <h1>Final Result: ${calculateResults(correctAnswers)}%</h1>
  `;
});

continueButton.addEventListener('click', () => {
  randomizedQArray = sortRandom(incorrectlyAnsweredQuestions);
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
