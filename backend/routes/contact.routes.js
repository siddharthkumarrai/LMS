import { Router } from 'express';
import {contactUs} from '../controller/contact.controller.js'

const router = Router();

router.post('/', contactUs);

export default router;