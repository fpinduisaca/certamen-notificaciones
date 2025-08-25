'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");

const routes = require('./utils/routes');
const config = require('./utils/config');


class Server{

    constructor(){
        this.port =  process.env.PORT || 54321;
        this.host = `0.0.0.0`;

        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    appConfig(){
        this.app.use(
            bodyParser.json()
        );
        this.app.use(bodyParser.urlencoded({ extended: false}));
        this.app.use(methodOverride());
        new config(this.app);
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app,this.socket).routesConfig();
    }
    /* Including app Routes ends*/

    appExecute(){

        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Servidor corriendo en http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();