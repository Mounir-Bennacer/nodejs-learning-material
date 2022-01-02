import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Controller from '@utils/interfaces/controller.interface';
import errorMiddleware from "@middleware/error.middleware";

class App{
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number){
        this.express = express();
        this.port = port;

        this.initDatabaseConnection();
        this.initMiddleware();
        this.initControllers(controllers);
        this.exceptionHandler();
    }

    private initDatabaseConnection(): void{
        const MONGO_PATH = process.env.MONGO_PATH || 'mongodb://localhost:27017/'

        mongoose.connect(MONGO_PATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }

    private initMiddleware(): void{
        this.express.use(helmet())
        this.express.use(cors())
        this.express.use(compression())
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
    }

    private initControllers(controllers: Controller[]): void{
        controllers.forEach(controller => {
            this.express.use(`/api/${process.env.API_VERSION}`, controller.router)
        })
    }

    private exceptionHandler(): void{
        this.express.use(errorMiddleware)
    }

    public listen(): void{
        this.express.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        })
    }
}

export default App;
