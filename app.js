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

function changeNextButton() {
  next.innerHTML = `Done <i class="material-icons right">send</i>`;
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

function paginationCheck(p) {
  // if (p == 0) {
  //   previous.style.pointerEvents = 'none';
  // } else {
  //   previous.style.pointerEvents = 'auto';
  //   previous.classList.remove('disabled');
  // }
  if (pagination == randomizedQArray.length - 1) {
    determinate.classList.add('red', 'accent-4');
    return true;
    // next.style.pointerEvents = 'none';
    // next.classList.add('disabled');
  }
  return false;
  // else {
  //   next.style.pointerEvents = 'auto';
  //   next.classList.remove('disabled');
  // }
}

function populateQContainer(element, pagination) {
  var newH2 = document.createElement('h2');
  newH2.innerHTML =
    `Question ${pagination + 1}: ` + randomizedQArray[pagination];
  element.appendChild(newH2);
  var choices = QnAdata[randomizedQArray[pagination]].choices;

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
    // numBox.setAttribute('max', currentMax + 1);
    determinate.style.width = `${currentProgress}%`;
  }
}

function preLoader() {
  modalMsg.innerHTML = `
    <h4 class="center">Loading Results</h4>
    <br/><br/>
    <div class="row">
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
function calculateResults() {
  var numberOfQuestions = randomizedQArray.length;
  console.log(numberOfQuestions);
  var numberOfCorrect = 0;
  for (var i = 0; i < numberOfQuestions; i++) {
    if (answersArray[i] == QnAdata[randomizedQArray[i]].correct) {
      numberOfCorrect += 1;
    }
  }
  var results = roundToHundredths((numberOfCorrect / numberOfQuestions) * 100);
  return results;
}

function showResults(res) {
  modalMsg.innerHTML = `
    <div class="center">
      <h4>Results</h4>
      <h5> Your have a grade of ${res}%</h5>
    </div>
  `;
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
};

function getElement(s) {
  return document.querySelector(s);
}

function getElements(s) {
  return document.querySelectorAll(s);
}
const questionContainer = getElement('.questions');
// const previous = getElement('.previous');
const next = getElement('.next');
const buttonContainer = getElement('.buttonContainer');
// const form = getElement('form');
// const numBox = getElement('.numBox');
// const done = getElement('.done');
const modalMsg = getElement('.modalMsg');
const determinate = getElement('.determinate');
const modal = getElement('.modal');

// question keys
var questionsArray = generateQuestions(QnAdata);
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

// previous.addEventListener('click', () => {
//   var answer = validateRadio();
//   if (answer) {
//     populateAnswersArray(answer, pagination);
//     pagination -= 1;
//     flushQContainer(questionContainer);
//     populateQContainer(questionContainer, pagination);
//     paginationCheck(pagination);
//   } else {
//     alert('Answer');
//   }
// });

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

next.addEventListener('click', (e) => {
  var answer = validateRadio();
  if (answer) {
    answersArray.push(answer);
    pagination += 1;
    flushQContainer(questionContainer);
    populateQContainer(questionContainer, pagination);
    var finalQuestion = paginationCheck(pagination);
    if (finalQuestion) {
      var newButton = document.createElement('button');
      newButton.classList.add('btn', 'modal-trigger');
      newButton.setAttribute('type', 'submit');
      newButton.setAttribute('data-target', 'modal1');
      newButton.innerHTML = `Done <i class="material-icons right">send</i>`;
      pulseOnChecked(newButton);
      newButton.addEventListener('click', () => {
        var answer = validateRadio();
        if (answer) {
          M.Modal.init(modal, {
            dismissible: false,
          });
          preLoader();
          window.setTimeout(() => {
            var results = calculateResults();
            showResults(results);
          }, 5000);
          answersArray.push(answer);
        } else {
          alert('answer');
        }
      });
      buttonContainer.appendChild(newButton);
      buttonContainer.removeChild(next);
    }
  } else {
    alert('Answer');
  }
  //   if (e.target.classList.contains('disabled')) {
  //     var radios = getElements(`input[name="question"]`);
  //     console.log(radios);
  //     radios.forEach((radio) => {
  //       radio.addEventListener('click', (re) => {
  //         if (re.target.checked) {
  //           done.classList.remove('disabled');
  //           done.classList.add(
  //             'btn-large',
  //             'waves-effect',
  //             'waves-light',
  //             'pulse'
  //           );
  //           done.innerHTML = `Done <i class="material-icons right">send</i>`;
  //         }
  //       });
  //     });
  //   }
});

// form.addEventListener('submit', (e) => {
//   var answer = validateRadio();
//   if (answer) {
//     populateAnswersArray(answer, pagination);
//     pagination = numBox.value - 1;
//     flushQContainer(questionContainer);
//     populateQContainer(questionContainer, pagination);
//     paginationCheck(pagination);
//   } else {
//     alert('Answer');
//   }
//   e.preventDefault();
// });

// done.addEventListener('click', () => {
//   // alert();
//   var answer = validateRadio();
// answersArray.push(answer);
// modalMsg.innerHTML = `
//   <h5>Review of all the questions and your answers</h5>
//   <p>
// `;
// for (var i = 0; i < randomizedQArray.length; i++) {
//   modalMsg.innerHTML += `
//   <span class="new badge blue" data-badge-caption="Question"></span>Question ${
//     i + 1
//   }: ${randomizedQArray[i]}
//     <br>
//     You answered: ${answersArray[i]}
//     <br>
//   `;
// }
// modalMsg.innerHTML += `</p>`;
// });

// modal js
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit(modal);
  // var instances = M.Modal.init(modal, {
  //   dismissible: false,
  // });
});

// `
//   <h5>Review of all the questions and your answers</h5>
//   <p>
// `;
// for (var i = 0; i < randomizedQArray.length; i++) {
//   modalMsg.innerHTML += `
//   <span class="new badge blue" data-badge-caption="Question"></span>Question ${
//     i + 1
//   }: ${randomizedQArray[i]}
//     <br/>
//     You answered: ${answersArray[i]}
//     <br/><br/>
//   `;
