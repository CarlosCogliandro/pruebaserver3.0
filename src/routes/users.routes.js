import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import uploader from "../services/upload.service.js"
import { passportCall } from "../middleware/passAuth.js";

const router = Router();
const userController = new UserController();

router.post('/premium/:uid', userController.upgradeToPremium);

router.post('/update/:uid', userController.updateUserPremium);

router.get('/', userController.getUsers);

router.delete('/:uid', userController.deleteUser);

router.delete('/', passportCall("jwt"), userController.deleteInactiveUsers);

router.post('/:uid/documents', uploader.fields([
    {name:"profiles", maxCount:1},
    {name:"products", maxCount:1},
    {name:"document", maxCount:1},
]), userController.uploadFiles);

router.post('/:uid/premium-documents', uploader.fields([
    {name:"identificationDocument", maxCount:1},
    {name:"domicileProofDocument", maxCount:1},
    {name:"accountStatementDocument", maxCount:1},
]), userController.uploadPremiumDocuments);

export default router;