const dialog = document.querySelector('#plan-dialog');
const form = document.querySelector('#plan-form');
const subjectInput = document.querySelector('#subject');
const durationInput = document.querySelector('#duration');
const result = document.querySelector('#plan-result');
const resultTitle = document.querySelector('#result-title');
const total = document.querySelector('#plan-total');
const blocks = document.querySelector('#plan-blocks');
const openButtons = document.querySelectorAll('[data-open-plan]');

openButtons.forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', () => {
    if (!dialog.open) dialog.showModal();
    window.setTimeout(() => subjectInput.focus(), 0);
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#edit-plan').addEventListener('click', () => {
  result.hidden = true;
  form.hidden = false;
  subjectInput.focus();
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const sessions = {
  15: [
    { minutes: 3, title: 'Warm up your memory', detail: 'Write down what you already know.' },
    { minutes: 8, title: 'Focus on one idea', detail: 'Review the key concept and explain it in your own words.' },
    { minutes: 4, title: 'Check and reflect', detail: 'Try one quick question, then note what to revisit.' }
  ],
  30: [
    { minutes: 5, title: 'Warm up your memory', detail: 'Jot down key points without looking at your notes.' },
    { minutes: 15, title: 'Build understanding', detail: 'Review one concept, then explain it in your own words.' },
    { minutes: 7, title: 'Practise retrieval', detail: 'Answer a few questions from memory.' },
    { minutes: 3, title: 'Reflect and reset', detail: 'Check your answers and choose a next step.' }
  ],
  60: [
    { minutes: 8, title: 'Warm up your memory', detail: 'Map what you already know about this topic.' },
    { minutes: 22, title: 'Build understanding', detail: 'Review one section and connect it to what you know.' },
    { minutes: 5, title: 'Take a real break', detail: 'Stand up, stretch, and give your attention a reset.' },
    { minutes: 18, title: 'Practise retrieval', detail: 'Work through questions without checking your notes.' },
    { minutes: 7, title: 'Reflect and reset', detail: 'Review gaps and write down your next small step.' }
  ]
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const subject = subjectInput.value.trim();
  if (!subject) {
    subjectInput.setCustomValidity('Enter a subject or topic to make your plan.');
    subjectInput.reportValidity();
    return;
  }
  subjectInput.setCustomValidity('');

  const duration = Number(durationInput.value);
  const plan = sessions[duration];
  resultTitle.textContent = subject;
  total.textContent = `${duration} minutes, with time to learn, practise, and reflect.`;
  blocks.replaceChildren(...plan.map((item) => {
    const row = document.createElement('li');
    const time = document.createElement('time');
    time.textContent = `${item.minutes} min`;
    const description = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = item.title;
    const detail = document.createElement('span');
    detail.textContent = item.detail;
    description.append(title, detail);
    row.append(time, description);
    return row;
  }));
  form.hidden = true;
  result.hidden = false;
  result.focus();
});

subjectInput.addEventListener('input', () => subjectInput.setCustomValidity(''));
