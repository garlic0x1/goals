import { buildElement } from './builder.js';
import { buildSubmit, buildTextField } from './components.js';

//--------------------//
// Store Manipulation //
//--------------------//

// utils

function get(key) {
  return JSON.parse(localStorage.getItem(key));
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function swap(key, func) {
  return set(key, func(get(key)));
}

// history

function dayOldP(date) {
  const now = new Date();
  const day = 24 * 60 * 60 * 1000;
  return now - day > day;
}

function recordDay(goals) {
  const last_recorded = swap('last_recorded', value => {
    if (value) return value;
    return new Date();
  });
  if (dayOldP(last_recorded)) {
    swap('history', value => [...(value || []), goals]);
    set('last_recorded', new Date());
  } else {
    swap('history', value => {
      (value || []).pop();
      return [...(value || []), goals];
    });
  }
}

// goals

function appendGoal(name, target) {
  swap('goals', value => {
    return [...(value || []), {
    'id': crypto.randomUUID(),
    'name': name,
    'count': 0,
    'target': target
    }];
  });
}

function clearGoals() {
  set('goals', []);
  renderGoals();
}

function incGoal(id) {
  const goals = get('goals') || [];
  const goal = goals.find(goal => goal.id == id);
  goal.count = goal.count + 1;
  recordDay(goals);
  set('goals', goals);
  renderGoals();
}

function zeroGoal(id) {
  const goals = get('goals') || [];
  const goal = goals.find(goal => goal.id == id);
  goal.count = 0;
  recordDay(goals);
  set('goals', goals);
  renderGoals();
}

//------------//
// Components //
//------------//

function buildGoal({ id, name, count, target }) {
  const goalStyles = () => {
    if (count < target) return ['circle', 'red'];
    if (count < target * 1.5) return ['circle', 'green'];
    return ['circle', 'gold'];
  }

  return buildElement('div')
    .withClass('goal')
    .withChild(
      buildElement('span')
	.withText(name)
	.build()
    )
    .withChild(
      buildElement('div')
	.withClasses(goalStyles())
	.withText(count + '/' + target)
	.withEventListener('click', () => incGoal(id))
	.withEventListener('contextmenu', e => {
	  e.preventDefault();
	  zeroGoal(id);
	})
	.build()
    )
    .build();
}

function buildGoals() {
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  return buildElement('div')
    .withClass('goals')
    .withChildren(goals.map(goal => buildGoal(goal)))
    .build();
}

function buildGoalForm(killForm, submitForm) {
  return buildElement('form')
    .withClasses(['modal'])
    .withChildren([
      buildTextField('text', 'name'),
      buildTextField('number', 'target'),
      buildSubmit(),
      buildElement('button')
	.withText('Cancel')
	.withEventListener('click', killForm)
	.build()
    ])
    .withEventListener('submit', submitForm)
    .build();
}

//-----------//
// Rendering //
//-----------//

function renderGoals() {
  const mount = document.querySelector('#goals');
  const goals = buildGoals();
  mount.innerHTML = '';
  mount.appendChild(goals);
}

function renderGoalForm() {
  const mount = document.querySelector('#goal-form');
  const killForm = () => mount.innerHTML = "";
  const submitForm = e => appendGoal(e.target[0].value, e.target[1].value);
  const form = buildGoalForm(killForm, submitForm);
  mount.appendChild(form);
}

//------------//
// Initialize //
//------------//

document.getElementById('new-goal').onclick = renderGoalForm;
document.getElementById('clear-goals').onclick = clearGoals;
renderGoals();
