/**
 * auth.js
 * Handles login and registration form submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');

  // --- LOGIN LOGIC ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (loginError) {
        loginError.classList.add('hidden');
        loginError.textContent = '';
      }

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Logging in...';
      submitBtn.disabled = true;

      try {
        await window.api.auth.login(email, password);
        // Successful login, redirect
        window.location.href = 'index.html';
      } catch (error) {
        if (loginError) {
          loginError.textContent = error.message || 'Incorrect email or password.';
          loginError.classList.remove('hidden');
        }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // --- REGISTER LOGIC ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (registerError) {
        registerError.classList.add('hidden');
        registerError.textContent = '';
      }

      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const city = document.getElementById('register-city')?.value;
      const field = document.getElementById('register-field')?.value;
      const study_level = document.getElementById('register-study-level')?.value;
      
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating account...';
      submitBtn.disabled = true;

      try {
        await window.api.auth.register({ name, email, password, city, field, study_level });
        // Automatically login after register
        await window.api.auth.login(email, password);
        window.location.href = 'index.html';
      } catch (error) {
        if (registerError) {
          registerError.textContent = error.message || 'An error occurred during registration.';
          registerError.classList.remove('hidden');
        }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
