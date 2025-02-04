import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { handleResult, handleError } from "./helper.js";
import { transferXlsxToJson } from "./module.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.join(__dirname, "../upload");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
const analyserController = {
    upload: upload,
    analyser_ping: async (req, res) => {
        try {
            handleResult(res, "hello2", 200);
        } catch (error) {
            handleError(res, "hello", 404);
        }
    },
    analyser_upload: async (req, res) => {
        try {
            if (!req.file) {
                return handleError(res, "No file uploaded.", 400);
            }

            const result = {
                message: "File uploaded successfully.",
                file: req.file.originalname,
            };

            handleResult(res, result, 200);
        } catch (error) {
            console.error("Upload error:", error);
            handleError(res, "File upload failed", 500);
        }
    },
    analyser_read: async (req, res) => {
        try {
            const jsonData = transferXlsxToJson()
            handleResult(res, jsonData, 200);
        } catch (error) {
            handleError(res, "Failed to read file", 500);
        }
    }
};

export default analyserController;
