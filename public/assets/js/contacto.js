// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validar formulario
      if (!validateForm()) {
        return;
      }

      // Obtener datos del formulario
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        service: document.getElementById('service').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value,
        newsletter: document.querySelector('input[name="newsletter"]').checked,
        terms: document.querySelector('input[name="terms"]').checked
      };

      // Simular envío (aquí conectarías con tu backend)
      submitForm(formData);
    });
  }

  function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    const terms = document.querySelector('input[name="terms"]').checked;

    // Validar campos obligatorios
    if (!firstName || !lastName || !email || !service || !message) {
      showMessage('Por favor, completa todos los campos obligatorios.', 'error');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Por favor, ingresa un email válido.', 'error');
      return false;
    }

    // Validar términos
    if (!terms) {
      showMessage('Debes aceptar los términos y condiciones.', 'error');
      return false;
    }

    return true;
  }

  function submitForm(formData) {
  const submitBtn = contactForm.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enviando...';
  submitBtn.disabled = true;

  // Enviar datos reales al servidor PHP
  fetch('sendMail.php', {
    method: 'POST',
    body: new FormData(contactForm)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      showMessage(data.message, 'success');
      contactForm.reset();
    } else {
      showMessage(data.message, 'error');
    }
  })
  .catch(error => {
    showMessage('Hubo un error al enviar el mensaje. Intenta nuevamente.', 'error');
    console.error('Error:', error);
  })
  .finally(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}


  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }

  // Animación de inputs al escribir
  const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });

  // Mobile Menu Toggle (si no está en otro archivo)
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }
});