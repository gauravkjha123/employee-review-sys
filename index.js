import db from './config/db.js';
import express from 'express';
import logger from "./lib/logger/logger.js";
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import flash from 'connect-flash';
import flashMiddleware from './middlwere/flash.js'
import routes from './routes/index.js'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser';
import expressLayout from 'express-ejs-layouts';
import path from 'path'
import { HttpError } from 'routing-controllers';
import  { env } from './env.js'
import { banner } from './lib/banner.js';


const app = express();
const millisecondsInADay = 24 * 60 * 60 * 1000;
// Define the port,
let port = env.app.port;

// Enable CORS middleware to allow cross-origin requests
app.use(cors());

// Enable body parsing middleware for JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

// CookieParser
app.use(cookieParser())

app.use(session({  
  name: env.session.name,
  secret: env.session.secret,  
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: Number(env.session.expireIN)*millisecondsInADay 
  }, 
  store:MongoStore.create({
    mongoUrl:env.db.mongoUrl,
    autoRemove:'disabled'
  })
}));

//---------Connect Flash----------//
app.use(flash());
app.use(flashMiddleware)

app.use(expressLayout);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// public | static file 
app.use(express.static(path.join(process.cwd(), 'public'))); 


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//---------Web API----------//
app.use('/',routes);


//Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
      logger.error(err);
      return res.status(500).send(err);
    }
    console.error(err.stack);
   return res.status(500).json({ error: 'Internal Server Error' });
  });
  

app.listen(port, () =>banner(logger));
