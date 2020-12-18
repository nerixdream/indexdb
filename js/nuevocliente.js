(() => {
	const formulario = document.querySelector('#formulario');
	let DB;

	document.addEventListener('DOMContentLoaded', function () {
		conectarDB();
		formulario.addEventListener('submit', validarUsuario);
	});

	function conectarDB() {
		const conexionDB = window.indexedDB.open('crm', 1);

		conexionDB.onerror = () => console.log('Hubo un error');

		conexionDB.onsuccess = () => {
			DB = conexionDB.result;
		};
	}

	function validarUsuario(e) {
		e.preventDefault();

		const nombre = document.querySelector('#nombre').value;
		const email = document.querySelector('#email').value;
		const telefono = document.querySelector('#telefono').value;
		const empresa = document.querySelector('#empresa').value;

		if (nombre === '' || email === '' || telefono === '' || empresa === '') {
			mostrarMensaje('Todos los campos son obligatorios', 'error');
			return;
		}

		const cliente = {
			nombre,
			email,
			telefono,
			empresa,
		};

		cliente.id = Date.now();

		console.log(cliente);
		crearCliente(cliente);
	}

	function crearCliente(cliente) {
		const transaction = DB.transaction(['crm'], 'readwrite');
		const objectStore = transaction.objectStore('crm');
		objectStore.add(cliente);
		transaction.onerror = () => mostrarMensaje('Hubo un error, revise los campos', 'error');
		transaction.oncomplete = () => {
			mostrarMensaje('Cliente agregado correctamente');
			setTimeout(() => {
				window.location.href = 'index.html';
			}, 2000);
		};
	}
})();
