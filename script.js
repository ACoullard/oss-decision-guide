const questions = Array.from(document.querySelectorAll('.question'));
const resultYes = document.getElementById('result-yes');
const resultNo = document.getElementById('result-no');
const guidelines = document.getElementById('guidelines');

const answers = new Array(questions.length).fill(null);

function reveal(el, scroll = true) {
  el.classList.remove('hidden');
  el.classList.add('revealing');
  void el.offsetHeight;
  el.classList.remove('revealing');
  el.classList.add('visible');
  if (scroll) {
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
}

function hide(el) {
  el.classList.remove('visible', 'revealing');
  el.classList.add('hidden');
}

function setQuestionSelection(questionEl, value) {
  questionEl.querySelectorAll('.btn-answer').forEach(btn => {
    btn.classList.remove('selected-yes', 'selected-no', 'unselected');
    if (value) {
      if (btn.dataset.answer === value) {
        btn.classList.add(value === 'yes' ? 'selected-yes' : 'selected-no');
      } else {
        btn.classList.add('unselected');
      }
    }
  });
}

function resetDownstream(fromIndex) {
  for (let i = fromIndex + 1; i < questions.length; i++) {
    hide(questions[i]);
    answers[i] = null;
    setQuestionSelection(questions[i], null);
  }
  hide(resultYes);
  hide(resultNo);
  hide(guidelines);
}

function revealResult(type) {
  const card = type === 'yes' ? resultYes : resultNo;
  reveal(card);
  setTimeout(() => reveal(guidelines, false), 600);
}

function answer(questionIndex, value) {
  if (answers[questionIndex] === value) return;

  if (answers[questionIndex] !== null) {
    resetDownstream(questionIndex);
  }

  answers[questionIndex] = value;
  setQuestionSelection(questions[questionIndex], value);

  if (value === 'no') {
    setTimeout(() => revealResult('no'), 300);
    return;
  }

  const nextQuestion = questions[questionIndex + 1];
  if (nextQuestion) {
    setTimeout(() => reveal(nextQuestion), 300);
  } else {
    setTimeout(() => revealResult('yes'), 300);
  }
}

questions.forEach((questionEl, index) => {
  questionEl.querySelectorAll('.btn-answer').forEach(btn => {
    btn.addEventListener('click', () => answer(index, btn.dataset.answer));
  });
});
