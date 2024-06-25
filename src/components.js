import { buildElement } from './builder.js';

export function buildSubmit() {
  return buildElement('button')
    .withClass('form__button')
    .withAttribute('type', 'submit')
    .withText('Continue')
    .build();
}

export function buildTextField(type, placeholder) {
  return buildElement('div')
    .withClass('form__input-group')
    .withHtml(`
      <input type="${type}" class="form__input" autofocus placeholder="${placeholder}">
      <div class="form__input-error-message"></div>
    `)
    .build();
}
