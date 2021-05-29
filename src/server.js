const Hapi = require('@hapi/hapi');
const routes = require('./routes');


const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: { //jika ingin mengaktifkan CORS pada setiap routes bisa menggunakan seperti ini
            cors: {
                origin: ['*'],
            }
        }
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};


init();