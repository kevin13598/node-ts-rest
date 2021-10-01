import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import PostsRoutes from './routes/PostsRoutes'
import UserRoutes from './routes/UserRoutes';

class Server {

    public app: express.Application;
    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {

        const MONGO_URI = `mongodb+srv://dbUser:rjpAtanYMQW3xbQy@cluster0.vot8j.mongodb.net/restapi?retryWrites=true&w=majority`;

        mongoose.set('useFindAndModify', true);

        mongoose.connect(MONGO_URI || process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(db => console.log('DB is connected'));

        //Settings
        this.app.set('port', process.env.PORT || 3000);

        //Middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use('/api/posts',PostsRoutes);
        this.app.use('/api/users',UserRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();