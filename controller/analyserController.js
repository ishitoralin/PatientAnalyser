import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { handleResult, handleError } from "./helper.js";
import { getData, getList, transferXlsxToJson } from "./module.js"
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
    analyser_analyse: async (req, res) => {
        try {
            const { file, sub, init } = req.query
            if (!file) {
                return handleError(res, "Please specify file", 404)
            }

            const result = getData(file, sub, init)
            return handleResult(res, result, 200)
        } catch (error) {
            return handleError(res, error.message, error.status)
        }
    },
    analyser_list: async (req, res) => {
        try {
            const result = getList()
            return handleResult(res, result, 200);
        } catch (error) {
            return handleError(res, error, 404);
        }
    },
    analyser_ping: async (req, res) => {
        try {
            return handleResult(res, "hello", 200);
        } catch (error) {
            return handleError(res, "hello", 404);
        }
    },
    analyser_read: async (req, res) => {
        try {
            const query = req.query.file
            if (!query) {
                return handleError(res, "Please specify target file", 404);
            }
            const jsonData = transferXlsxToJson(query)
            return handleResult(res, jsonData, 200);
        } catch (error) {
            return handleError(res, "Failed to read file", 500);
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

            return handleResult(res, result, 200);
        } catch (error) {
            console.error("Upload error:", error);
            return handleError(res, "File upload failed", 500);
        }
    },
};

export default analyserController;
