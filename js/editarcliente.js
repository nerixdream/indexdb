(() => {
	let DB;
	let clienteID;

	const nombreInput = document.querySelector('#nombre');
	const emailInput = document.querySelector('#email');
	const telefonoInput = document.querySelector('#telefono');
	const empresaInput = document.querySelector('#empresa');

	const formulario = document.querySelector('#formulario');

	document.addEventListener('DOMContentLoaded', () => {
		conectarDB();

		formulario.addEventListener('submit', editarCliente);

		//Verificar el ID de la URL

		const parametrosURL = new URLSearchParams(window.location.search);
		clienteID = parametrosURL.get('id');

		if (clienteID) {
			setTimeout(() => {
				obtenerCliente(clienteID);
			}, 500);
		}
	});

	function editarCliente(e) {
		e.preventDefault();

		if (
			nombreInput.value === '' ||
			emailInput.value === '' ||
			telefonoInput.value === '' ||
			empresaInput.value === ''
		) {
			mostrarMensaje('Todos los campos son obligatorios', 'error');
			return;
		}

		//Guardar cambios
		const clienteActualizado = {
			nombre: nombreInput.value,
			email: emailInput.value,
			telefono: telefonoInput.value,
			empresa: empresaInput.value,
			id: Number(clienteID),
		};

		const transaction = DB.transaction(['crm'], 'readwrite');
		const objectStore = transaction.objectStore('crm');

		objectStore.put(clienteActualizado);

		transaction.oncomplete = () => {
			mostrarMensaje('Cliente editado correctamente');

			setTimeout(() => {
				window.location.href = 'index.html';
			}, 3000);
		};

		transaction.onerror = () => mostrarMensaje('Hubo un error, revise los datos', 'error');
	}

	function obtenerCliente(ID) {
		const transaction = DB.transaction(['crm'], 'readwrite');

		const objectStore = transaction.objectStore('crm');

		const cliente = objectStore.openCursor();

		cliente.onsuccess = (e) => {
			const cursor = e.target.result;

			if (cursor) {
				if (cursor.value.id === Number(ID)) {
					llenarFormulario(cursor.value);
				}
				cursor.continue();
			}
		};
	}

	function llenarFormulario(datosCliente) {
		const { nombre, email, telefono, empresa, id } = datosCliente;

		nombreInput.value = nombre;
		emailInput.value = email;
		telefonoInput.value = telefono;
		empresaInput.value = empresa;
	}

	function conectarDB() {
		const conexionDB = window.indexedDB.open('crm', 1);

		conexionDB.onerror = () => console.log('Hubo un error');

		conexionDB.onsuccess = () => (DB = conexionDB.result);
	}
})();
