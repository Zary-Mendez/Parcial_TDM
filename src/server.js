const http = require("http"); //Módulo para crear servidor tipo node.js
const path = require("path"); //Módulo para manipular rutas de archivos y directorios
const fs = require("fs"); //Módulo para interactuar con archivos del servidor

const PORT = 3000;

//Ruta pública __dirname(ruta absoluta), .. (sube un nivel en jerarquia de directorio), public (carpeta de archivos públicos)
//path.join para unir rutas
const PUBLIC_PATH = path.join(__dirname, "..", "public");

//Se crea servidor
//http.createServer puede recibir parámetros cómo ([options], [requestListener (req, res)])
const server = http.createServer((req, res) => {

    //Se imprime en la consola la fecha el método del request y url que sirve el servidor
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    //Se establece el archivo que se va a servir, si la ruta es "/" => index.html, si no => cualquier otra req.url 
    let filePath = req.url === "/" ? "index.html" : req.url;
    
    //En el caso que se requiera hacer consultas query por la url
        // const parseUrl = new URL(req.url, `http://${req.headers.host}`);
        // let filePath = parsedUrl.pathname === "/" ? "main.html" : parsedUrl.pathname;

    //Se extrae la extención del archivo servido para luego ser utilizado como respuesta de header del servidor.
    const exname = path.extname(filePath);

    //Se crea diccionario con los diferentes tipos de archivos a los que se puede servir
    mimeTypes = {
        ".html": "text/html",
        ".css": "text/css", 
        ".js": "text/javascript",
        ".json": "application/json",
        ".png": "image/png", 
        ".jpg": "image/jpg",
        ".gif": "image/gif"
    };

    //Se establece la ruta completa a la se debe servir, ruta pública (PUBLIC_PATH) + ruta del archivo (filePath)
    const fullPath = path.join(PUBLIC_PATH, filePath);

    //Lee el archivo de la ruta completa
    fs.readFile(fullPath, (err, content) => {

    //Se gestiona cómo el server responde (res) a las peticiones (req)

        if (err) { //Si encuentra algun error al leer el archivo de la ruta devuelve el error encontrado.
            res.writeHead(err.code === "ENOEN" ? 404 : 500);
            res.end(err.code === "ENOEN" ? "404 Ruta no encontrada" : `Error: ${err.code}`);
        }else { //Si no devuelve el contenido del archivo leido
            res.writeHead(200, {
                "Content-type": mimeTypes[exname] || "text/plain"
            });

            res.end(content);
        }

    });


});

//Se configura puerto por donde el server "escuchara" las peticiones, 
// sin el no funciona pues no podría recibir (req) ni enviar (res) peticiones.
server.listen(PORT, "localhost", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});