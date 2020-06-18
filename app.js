function sortRandom(array) {
  array.sort((a, b) => 0.5 - Math.random());
  return array;
}
function populateAnswersArray(answer, pagination) {
  if (answersArray) {
    if (pagination > currentMax) {
      answersArray.push(answer);
    } else {
      answersArray[pagination] = answer;
    }
  } else {
    answersArray.push(answer);
  }
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

function paginationCheck(p) {
  if (p == 0) {
    previous.style.pointerEvents = 'none';
  } else {
    previous.style.pointerEvents = 'auto';
    previous.classList.remove('disabled');
  }
  if (p >= randomizedQArray.length - 1) {
    next.style.pointerEvents = 'none';
    next.classList.add('disabled');
  } else {
    next.style.pointerEvents = 'auto';
    next.classList.remove('disabled');
  }
}

function populateQContainer(element, pagination) {
  var newH2 = document.createElement('h2');
  newH2.innerHTML =
    `Question ${pagination + 1}: ` + randomizedQArray[pagination];
  element.appendChild(newH2);
  var choices = questionAnswerData[randomizedQArray[pagination]].choices;

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
    numBox.setAttribute('max', currentMax + 1);
    determinate.style.width = `${currentProgress}%`;
  }
}

// keys = questions
// properties = correct answer, choices array.
var questionAnswerData = {
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
};

function getElement(s) {
  return document.querySelector(s);
}

function getElements(s) {
  return document.querySelectorAll(s);
}
const questionContainer = getElement('.questions');
const previous = getElement('.previous');
const next = getElement('.next');
const form = getElement('form');
const numBox = getElement('.numBox');
const done = getElement('.done');
const modalMsg = getElement('.modalMsg');
const determinate = getElement('.determinate');

// question keys
var questionsArray = generateQuestions(questionAnswerData);
// random question keys order
var randomizedQArray = sortRandom(questionsArray);
var height = 20;
var width = 40;
var pulse = null;
var answersArray = [];
var pagination = 0;
var currentMax = 0;
var progressScale = Math.ceil(100 / randomizedQArray.length);

paginationCheck(pagination);
populateQContainer(questionContainer, pagination);

previous.addEventListener('click', () => {
  var answer = validateRadio();
  if (answer) {
    populateAnswersArray(answer, pagination);
    pagination -= 1;
    flushQContainer(questionContainer);
    populateQContainer(questionContainer, pagination);
    paginationCheck(pagination);
  } else {
    alert('Answer');
  }
});

next.addEventListener('click', (e) => {
  var answer = validateRadio();
  if (answer) {
    populateAnswersArray(answer, pagination);
    pagination += 1;
    flushQContainer(questionContainer);
    populateQContainer(questionContainer, pagination);
    paginationCheck(pagination);
    if (e.target.classList.contains('disabled')) {
      var radios = getElements(`input[name="question"]`);
      console.log(radios);
      radios.forEach((radio) => {
        radio.addEventListener('click', (re) => {
          if (re.target.checked) {
            done.classList.remove('disabled');
            done.classList.add(
              'btn-large',
              'waves-effect',
              'waves-light',
              'pulse'
            );
            done.innerHTML = `Done <i class="material-icons right">send</i>`;
          }
        });
      });
    }
  } else {
    alert('Answer');
  }
});

form.addEventListener('submit', (e) => {
  var answer = validateRadio();
  if (answer) {
    populateAnswersArray(answer, pagination);
    pagination = numBox.value - 1;
    flushQContainer(questionContainer);
    populateQContainer(questionContainer, pagination);
    paginationCheck(pagination);
  } else {
    alert('Answer');
  }
  e.preventDefault();
});

done.addEventListener('click', () => {
  // alert();
  var answer = validateRadio();
  answersArray.push(answer);
  modalMsg.innerHTML = `
    <h5>Review of all the questions and your answers</h5>
    <p>
  `;
  for (var i = 0; i < randomizedQArray.length; i++) {
    modalMsg.innerHTML += `
    <span class="new badge blue" data-badge-caption="Question"></span>Question ${
      i + 1
    }: ${randomizedQArray[i]}
      <br>
      You answered: ${answersArray[i]}
      <br>
    `;
  }
  modalMsg.innerHTML += `</p>`;
});

// modal js
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});
