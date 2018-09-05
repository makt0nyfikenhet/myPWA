/* Este script manda a llamar al Service Worker requerido
para que la PWA se pueda instalar en el dispositivo*/

if ( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register('./sw.js')                             // La funcion del registro del SW retorna una promesa:
    .then(reg => console.log('Registro de SW exitoso', reg))                // Si se pudo registrar el SW
    .catch(err => console.warn('Error al tratar de registrar el SW', err))  // Si da error al registrar el SW, se captura el error
}