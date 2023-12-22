import { Router } from "express";
import { sendEmail, sendEmailWithAttachments, sendEmailDelete } from '../controllers/email.controller.js'

const router = Router();

router.get('/', sendEmail);

router.get("/", sendEmailDelete);

router.get('/attachments', sendEmailWithAttachments)

export default router;