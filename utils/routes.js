'use strict';

class Routes{

    constructor(app,socket){
        this.app = app;
        this.io = socket;

        /*
         Array to store the list of users along with there respective socket id.
         */
        this.users = [];
    }


    appRoutes(){

        this.app.get('/', (request,response) => {
            response.render('index');
        });
    }

    socketEvents(){

        this.io.on('connection', (socket) => {

            console.log(' %s sockets connected', this.io.engine.clientsCount);

            console.info('Nuevo cliente conectado (id=' + socket.id + ').');

            socket.on('showDialogCalificar', (presentacionid, candidataid)  => {
                console.log("showDialogCalificar: %s,  %s", presentacionid, candidataid);
                this.io.emit('juradoCalificar', {presentacionid: presentacionid, candidataid: candidataid});
            });

            socket.on('candidataCalificada', (serverData)  => {
                console.log('candidataCalificada....');
                this.io.emit('showCalificacionCandidata', {serverData: serverData});
            });

            socket.on('certamenRedirect', (url)  => {
                console.log('certamenRedirect: %s', url);
                this.io.emit('certamenRedirectToUrl', url);
            });

            socket.on('disconnect',()=>{

                console.log("Desconectado cliente: ", socket.id);

                for(let i=0; i < this.users.length; i++){

                    if(this.users[i].id === socket.id){
                        this.users.splice(i,1);
                    }
                }
                this.io.emit('exit',this.users);
            });

        });

    }

    routesConfig(){
        this.appRoutes();
        this.socketEvents();
    }
}
module.exports = Routes;