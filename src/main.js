import { buildElement } from './builder.js';
import { buildSubmit, buildTextField } from './components.js';

//--------------------//
// Store Manipulation //
//--------------------//

function incGoal(id) {
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  const goal = goals.find(goal => goal.id == id);
  goal.count = goal.count + 1;
  localStorage.setItem('goals', JSON.stringify(goals));
  renderGoals();
}

function zeroGoal(id) {
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  const goal = goals.find(goal => goal.id == id);
  goal.count = 0;
  localStorage.setItem('goals', JSON.stringify(goals));
  renderGoals();
}

function appendGoal(name, target) {
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  localStorage.setItem('goals', JSON.stringify([...goals, {
    'id': crypto.randomUUID(),
    'name': name,
    'count': 0,
    'target': target
  }]));
}

function clearGoals() {
  localStorage.setItem('goals', '[]');
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
  console.log(localStorage.getItem('goals'));
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  console.log(goals);
  return buildElement('div')
    .withClass('goals')
    .withChildren(goals.map(goal => buildGoal(goal)))
    .build();
  console.log('done');
}

function goalForm() {
  const mount = document.querySelector('#goal-form');
  const form = buildElement('form')
	.withClasses(['modal'])
	.withChildren([
	  buildTextField('text', 'name'),
	  buildTextField('number', 'target'),
	  buildSubmit()
	])
	.withEventListener('submit', e => {
	  console.log('submitting');
	  const name = e.target[0].value;
	  const target = e.target[1].value;
	  console.log(name, target);
	  appendGoal(e.target[0].value, e.target[1].value);
	})
	.build();
  mount.appendChild(form);
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

document.getElementById('new-goal').onclick = goalForm;
document.getElementById('clear-goals').onclick = clearGoals;
renderGoals();
