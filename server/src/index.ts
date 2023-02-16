import MongoDBStore from 'connect-mongodb-session';
import dotenv from 'dotenv';
import express, { ErrorRequestHandler } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import meetingController from './controllers/meeting.controller';
import sessionController from './controllers/session.controller';
import userController from './controllers/user.controller';
import zoomController from './controllers/zoom.controller';

dotenv.config();

const { HOST, PORT, MONGODB_URI, SESSION_SECRET } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new (MongoDBStore(session))({
      uri: MONGODB_URI,
      collection: 'sessions',
    }),
  }),
);

app.get('/api', (req, res) => {
  res.json({ success: true });
});

app.use('/api/sessions', sessionController);
app.use('/api/users', userController);
app.use('/api/meetings', meetingController);
app.use('/api/zoom', zoomController);

app.use(((error, req, res, _) => {
  res.status(500).send({ success: false, error });
}) as ErrorRequestHandler);

(async () => {
  await mongoose.connect(MONGODB_URI);

  app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
