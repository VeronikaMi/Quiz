var id = '';
var difficulty = '';
var questions;
var score = 0;

document.querySelector('#dropdownMenuButton1').addEventListener('click', listCategories);

//fetching categories and listing them in dropdown menu
function listCategories() {
  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
      output = '';
      data.trivia_categories.forEach(category => {
        output += `
      <li id="${category.id}"><a class="dropdown-item" href="#">
      ${category.name}
      </a></li>`;
      });
      document.querySelector('#category').innerHTML = output;
    })
}

//getting category (id)
document.querySelector('#category').onclick = e => {
  var target = e.target;
  id = target.parentElement.id;
  document.querySelector('#dropdownMenuButton1').innerHTML = target.innerHTML;
};

//getting difficulty
document.querySelector('#difficulty').onclick = e => {
  var target = e.target;
  difficulty = target.innerHTML.toLowerCase();
  document.querySelector('#dropdownMenuButton2').innerHTML = target.innerHTML;
};

//hiding star page and reseting the values 
document.querySelector('#start').onclick = () => {
  document.querySelector('.start').classList.add('hide');
  document.querySelector('.test').classList.remove('hide');
  document.querySelector('#dropdownMenuButton1').innerHTML = 'Any category';
  document.querySelector('#dropdownMenuButton2').innerHTML = 'Any category';
  getQuestions();
}

//getting questions
async function getQuestions() {
  var api = getAPI();
  await fetch(api)
    .then(response => response.json())
    .then(data => {
      questions = data.results;
    });

  displayQuestion(0);
}

//constructing api
function getAPI() {
  var api;
  if (id === '' && difficulty === '') {
    api = 'https://opentdb.com/api.php?amount=10&type=multiple';
  }
  else if (difficulty === '') {
    api = `https://opentdb.com/api.php?amount=10&type=multiple&category=${id}`;
  }
  else if (id === '') {
    api = `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${difficulty}`;
  }
  else {
    api = `https://opentdb.com/api.php?amount=10&type=multiple&category=${id}&difficulty=${difficulty}`;
  }
  return api;
}

//shows questions recursivelly 
function displayQuestion(i) {
  document.querySelector('#question').innerHTML = questions[i].question;
  var answers = questions[i].incorrect_answers;
  var correctIndex = Math.floor(Math.random()*4);
  answers.splice(correctIndex, 0, questions[i].correct_answer);
  var output = '';
  answers.forEach(answer => {
    output += `
    <button class="answer">${answer}</button>
  `;
  });
  document.querySelector('#answers').innerHTML = output;
  var button = document.querySelector('#next');

  //getting answer and evaluating it(answer button clicked)
  document.querySelector('#answers').onclick = e => {
    var target = e.target;
    var selectedAnswer = target.innerHTML;

    //disable other buttons
    disableBtns(target);

    // correct? wrong? + score
    if (selectedAnswer == questions[i - 1].correct_answer)
      score++;

  };

  i++;
  if (i < questions.length) {
    button.onclick = () => {
      displayQuestion(i);
    }
  }
  else {
    button.innerHTML = 'Finish';
    button.onclick = () => {
      document.querySelector('.test').classList.add('hide');
      document.querySelector('.final').classList.remove('hide');
      document.querySelector('#score').innerHTML = `Score: ${score}/10`;
      document.querySelector('#restart').onclick = () => {
        location.reload();
      }
    }

  }
}

function disableBtns(target) {
  var buttons = document.querySelectorAll('.answer');
  buttons.forEach(button => {
    if (button != target && target.classList.contains('answer'))
      button.disabled = true;
  });
}


