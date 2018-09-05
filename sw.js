// Asignar un nombre y version al cache
const CACHE_NAME = 'miCache_v1',            // Nombre que se le quiere dar a la cache
urlsToCache = [                             // Urls que seran cacheadas
    './',                                   // Home 
    './style.css',                          // Las diferentes hojas de estilos utilizadas
    './script.js',                          // Los archivos js utilizados
    './img/icon_16.png',                     /* Recursos utilizados, como fotos, imagenes, favicon, etc.
                                               Sea que esten alojados en local o en un servidor remoto
                                            */
    './img/startup_image_wp.jpeg',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
]


/* Eventos importantes que necesita el SW */

// Nota: La palabra reservada 'self' es utilizada para referirse al SW

/* Durante la fase de instalacion, generalmente se almacena en cache los activos estaticos */
self.addEventListener( 'install' , e => {
    e.waitUntil(
        caches.open( CACHE_NAME )
        .then( cache => {
            return cache.addAll( urlsToCache ) // Retornar todo el cache
            .then( () => self.skipWaiting() )  // Seguir esperando hasta que termine la lista de urls en el cache
        })
        .catch( err => console.log( "Fallo registro de cache" , err ))   // En caso de que haya algun error con alguna url, o perdamos la conexion, etc
    )
})

/* Este evento es el que se encarga de buscar los recursos que esten en cache para que la PWA trate de funcionar sin conexion */
self.addEventListener('activate', e => {
    
    const cacheWhiteList = [ CACHE_NAME ]

    e.waitUntil(
        caches.keys()   // Ver las llaves para verificar que llaves de los archivos en cache han sufrido modificaciones
        .then( cachesNames => {
            cachesNames.map( cacheName => {
                // Eliminamos lo que ya no se necesita en cache
                if ( cacheWhiteList.indexOf( cacheName ) === -1 ) {
                    return caches.delete( cacheName )
                }
            })
        })
        // Le indica al SW activar el cache actual
        .then( () => self.clients.claim() ) //Indica que ha terminado de actualizar el cache
    )
})

/* Este evento es el que se encarga de recuperar todos los recursos del navegador
   cuando haya conexion a internet y tiene la capacidad de detectar si hubo un cambio con la version
   que tenia en cache vs la que esta descargando del servidor actualmente, y de encontrarse un cambio
   actualiza el archivo correspondiente en la cache */
self.addEventListener('fetch', e => {
    // Responder ya sea, con el objeto en cache o continuar y buscar la url real
    e.respondWith(
        caches.match( e.request )
        .then( res => {
            if ( res ) { // Si la URL (recurso) esta en cache, entonces:
                // Recuperando del cache
                return res
            }

            // Si no recupero el recurso del cache, y tuvo que ir a consultar una url real, entonces:
            return fetch( e.request )
        })
    )
})

