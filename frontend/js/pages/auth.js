import { login, register, getUser } from '../services/authService.js';
import { isEmail, isNotEmpty, isPassword } from '../utils/validators.js';

const container = document.getElementById('authContainer');

function goTo(state) {
  if (!container) return;
  container.classList.toggle('active', state === 'register');
  const url = state === 'register' ? 'register.html' : 'login.html';
  history.replaceState(null, '', url);
}

document.querySelectorAll('[data-switch]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(el.dataset.switch);
  });
});

function setupForm(form) {
  const kind = form.dataset.form;
  const alertEl = form.querySelector('[data-alert]');
  const submitBtn = form.querySelector('[data-submit]');
  const passwordToggle = form.querySelector('[data-password-toggle]');
  const passwordInput = form.querySelector('[data-field="password"]');

  function field(name) {
    return form.querySelector(`[data-field="${name}"]`);
  }

  function errorEl(name) {
    return form.querySelector(`[data-error="${name}"]`);
  }

  function showAlert(msg) {
    alertEl.textContent = msg;
    alertEl.className = 'form-alert error show';
  }

  function clearAlert() {
    alertEl.textContent = '';
    alertEl.className = 'form-alert';
  }

  function validateField(name, validator) {
    const input = field(name);
    const err = errorEl(name);
    const valid = validator(input.value);

    if (input.value && !valid) {
      input.classList.add('error');
      if (err) err.classList.add('show');
    } else {
      input.classList.remove('error');
      if (err) err.classList.remove('show');
    }
    return input.value ? valid : true;
  }

  function validateForm() {
    let valid = true;
    if (kind === 'register') {
      valid = validateField('name', isNotEmpty) && valid;
    }
    valid = validateField('email', isEmail) && valid;
    valid = validateField('password', isPassword) && valid;
    return valid;
  }

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      passwordToggle.classList.toggle('is-visible', type === 'text');
      passwordToggle.setAttribute('aria-label', type === 'text' ? 'Ocultar contraseña' : 'Mostrar contraseña');
      passwordToggle.classList.remove('toggled');
      void passwordToggle.offsetWidth;
      passwordToggle.classList.add('toggled');
    });
  }

  ['name', 'email', 'password'].forEach((name) => {
    const input = field(name);
    if (input) {
      input.addEventListener('input', () =>
        validateField(name, name === 'email' ? isEmail : name === 'password' ? isPassword : isNotEmpty)
      );
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    if (!validateForm()) {
      showAlert('Corrige los campos marcados en rojo');
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = kind === 'login' ? 'Ingresando...' : 'Creando cuenta...';

    try {
      if (kind === 'login') {
        await login(field('email').value.trim(), field('password').value);
      } else {
        await register(field('name').value.trim(), field('email').value.trim(), field('password').value);
      }
      const user = getUser();
      if (user && user.onboarding_completed) {
        window.location.href = '/app.html';
      } else {
        window.location.href = '/onboarding.html';
      }
    } catch (err) {
      showAlert(err.message || 'Error al procesar la solicitud');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.querySelectorAll('form[data-form]').forEach(setupForm);