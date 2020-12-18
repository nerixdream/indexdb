(() => {
	let DB;

	document.addEventListener('DOMContentLoaded', function () {
		crearDB();

		document.querySelector('#listado-clientes').addEventListener('click', eliminarCliente);

		if (window.indexedDB.open('crm', 1)) {
			obtenerClientes();
		}
	});

	function crearDB() {
		const crm = window.indexedDB.open('crm', 1);

		crm.onerror = function () {
			console.log('Ocurrio un error');
		};

		crm.onsuccess = function () {
			DB = crm.result;
		};

		crm.onupgradeneeded = function (e) {
			const db = e.target.result;

			let objectStore = db.createObjectStore('crm', {
				keyPath: 'id',
				autoIncrement: true,
			});

			objectStore.createIndex('nombre', 'nombre', { unique: false });
			objectStore.createIndex('email', 'email', { unique: true });
			objectStore.createIndex('telefono', 'telefono', { unique: false });
			objectStore.createIndex('empresa', 'empresa', { unique: false });
			objectStore.createIndex('id', 'id', { unique: true });

			console.log('DB lista y creada');
		};
	}

	//Trae lo registros de la base de datos
	function obtenerClientes() {
		const conexion = window.indexedDB.open('crm', 1);

		conexion.onerror = () => console.log('Hubo un error');

		conexion.onsuccess = () => {
			DB = conexion.result;

			const objectStore = DB.transaction('crm').objectStore('crm');

			objectStore.openCursor().onsuccess = (e) => {
				const cursor = e.target.result;

				if (cursor) {
					const { nombre, empresa, email, telefono, id } = cursor.value;

					const listado = document.querySelector('#listado-clientes');

					listado.innerHTML += `
						<tr>
							<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
								<p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
								<p class="text-sm leading-10 text-gray-700"> ${email} </p>
							</td>
							<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
								<p class="text-gray-700">${telefono}</p>
							</td>
							<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">
								<p class="text-gray-600">${empresa}</p>
							</td>
							<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
								<a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
								<a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
							</td>
						</tr>
					`;
					cursor.continue();
				} else {
					console.log('No hay más registros');
				}
			};
		};
	}

	function eliminarCliente(e) {
		if (e.target.classList.contains('eliminar')) {
			const clienteID = Number(e.target.dataset.cliente);
			const eliminar = confirm('¿Desea eliminar el cliente seleccionado?');

			if (eliminar) {
				const transaction = DB.transaction(['crm'], 'readwrite');
				const objectStore = transaction.objectStore('crm');

				objectStore.delete(clienteID);

				transaction.oncomplete = () => {
					console.log(`Eliminando el cliente con ID: ${clienteID}`);

					e.target.parentElement.parentElement.remove();
				};

				transaction.onerror = () => mostrarMensaje('Hubo un error', 'error');
			}
		}
	}
})();
