import express from "express"
import analyserController from "../controller/analyserController.js"
const router = express.Router()

router.get('/api/ping', analyserController.analyser_ping)
router.get('/api/read', analyserController.analyser_read)
router.post('/api/upload', analyserController.upload.single('file'), analyserController.analyser_upload)

export default router;
