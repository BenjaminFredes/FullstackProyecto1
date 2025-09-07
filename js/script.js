// Función para mostrar mensajes en un elemento dado
function mostrarMensaje(elemento, mensaje, tipo = 'danger') {
  elemento.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensaje}</div>`;
  elemento.className = 'mt-3';
}

// Validación de email con expresión regular
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validación de contraseña: mínimo 6 caracteres, letras y números
function validarPassword(password) {
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

// Validación del formulario de registro
function validarFormularioRegistro(data) {
  if (!data.nombre || !data.email || !data.equipo || !data.password || !data.passwordConf) {
    return 'Por favor, completa todos los campos.';
  }
  if (!validarEmail(data.email)) {
    return 'Correo electrónico inválido.';
  }
  if (data.password !== data.passwordConf) {
    return 'Las contraseñas no coinciden.';
  }
  if (!validarPassword(data.password)) {
    return 'La contraseña debe tener al menos 6 caracteres y contener letras y números.';
  }
  return null;
}

// Manejo del formulario de registro
const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
  const mensajeRegistro = document.getElementById('mensajeRegistro');

  formRegistro.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim().toLowerCase(),
      equipo: document.getElementById('equipo').value,
      password: document.getElementById('passwordReg').value,
      passwordConf: document.getElementById('passwordConf').value
    };

    const error = validarFormularioRegistro(data);
    if (error) {
      mostrarMensaje(mensajeRegistro, error);
      return;
    }

    // Obtener usuarios guardados en sessionStorage
    let usuarios = [];
    try {
      usuarios = JSON.parse(sessionStorage.getItem('usuarios')) || [];
    } catch {
      usuarios = [];
    }

    // Verificar si el email ya está registrado
    if (usuarios.some(u => u.email === data.email)) {
      mostrarMensaje(mensajeRegistro, 'El correo ya está registrado.');
      return;
    }

    // Guardar nuevo usuario
    usuarios.push({
      nombre: data.nombre,
      email: data.email,
      equipo: data.equipo,
      password: data.password
    });
    sessionStorage.setItem('usuarios', JSON.stringify(usuarios));

    formRegistro.reset();

    if (confirm(`¡Bienvenido, ${data.nombre}! Gracias por registrarte. ¿Quieres iniciar sesión ahora?`)) {
      window.location.href = 'Pagina.html';
    } else {
      mostrarMensaje(mensajeRegistro, 'Registro exitoso. Ahora puedes iniciar sesión.', 'success');
    }
  });
}

// Manejo del formulario de login
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  const mensajeLogin = document.getElementById('mensajeLogin');

  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();

    const usuarioInput = document.getElementById('usuario').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value;

    if (!usuarioInput || !passwordInput) {
      mensajeLogin.textContent = 'Por favor, completa todos los campos.';
      mensajeLogin.classList.add('text-danger');
      return;
    }

    let usuarios = [];
    try {
      usuarios = JSON.parse(sessionStorage.getItem('usuarios')) || [];
    } catch {
      usuarios = [];
    }

    const usuarioEncontrado = usuarios.find(u =>
      (u.email === usuarioInput || u.nombre.toLowerCase() === usuarioInput) && u.password === passwordInput
    );

    if (usuarioEncontrado) {
      const { password, ...datosUsuario } = usuarioEncontrado;
      sessionStorage.setItem('usuario', JSON.stringify(datosUsuario));
      window.location.href = 'Perfil.html';
    } else {
      mensajeLogin.textContent = 'Usuario o contraseña incorrectos.';
      mensajeLogin.classList.add('text-danger');
    }
  });
}

// Mostrar enlace "Mi Perfil" en el menú si el usuario está logueado
const menuNav = document.getElementById('menuNav');
if (menuNav) {
  const datosUsuarioStr = sessionStorage.getItem('usuario');
  if (datosUsuarioStr) {
    try {
      const datosUsuario = JSON.parse(datosUsuarioStr);
      if (!document.getElementById('miPerfilLink')) {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.id = 'miPerfilLink';
        li.innerHTML = `<a class="nav-link" href="Perfil.html" aria-current="page">Mi Perfil (${datosUsuario.nombre})</a>`;
        menuNav.appendChild(li);
      }
    } catch {
      sessionStorage.removeItem('usuario');
    }
  }
}

// Mostrar datos del usuario en Perfil.html y manejar cierre de sesión
const nombreUsuarioElem = document.getElementById('nombreUsuario');
if (nombreUsuarioElem) {
  const datosUsuarioStr = sessionStorage.getItem('usuario');
  if (!datosUsuarioStr) {
    window.location.href = 'Pagina.html';
  } else {
    try {
      const datosUsuario = JSON.parse(datosUsuarioStr);
      document.getElementById('nombreUsuario').textContent = datosUsuario.nombre || '';
      document.getElementById('emailUsuario').textContent = datosUsuario.email || '';
      document.getElementById('equipoUsuario').textContent = datosUsuario.equipo || '';
    } catch {
      sessionStorage.removeItem('usuario');
      window.location.href = 'Pagina.html';
    }
  }

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      sessionStorage.removeItem('usuario');
      window.location.href = 'Pagina.html';
    });
  }
}
