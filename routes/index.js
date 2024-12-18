import { Router } from 'express';
import roomController from './controllers/roomController';

const api = Router()
  .use(roomController)

export default Router().use('/api', api);