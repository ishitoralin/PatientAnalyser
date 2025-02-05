import { fileURLToPath } from "url";
import xlsx from "node-xlsx"
import path from "path";
import * as fs from "fs"
import { handleThrowError } from "./helper.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../upload")

export const getData = (file) => {
    const list = getList()
    const targetFile = list.filter((item) => item === file)[0]
    if (!targetFile) {
        throw handleThrowError(404, "File not found")
    }
    const jsonData = transferXlsxToJson(targetFile).filter((item) => item["欄5"] === "初診" || item["欄5"] === "複診")
        .sort((a, b) => a["病歷號碼"] - (b["病歷號碼"]));

    const result = []
    for (const item of jsonData) {
        if (item["欄5"] === "初診") {
            result.push({ [item["姓名"]]: [] })
        }
    }

    for (const multi of jsonData) {
        for (let i = 0; i < result.length; i++) {
            const key = Object.keys(result[i])[0]
            if (multi["姓名"] === key) {
                result[i][key].push({ id: multi["病歷號碼"], date: multi["就診日期"], dr: multi["醫師"], status: multi["欄5"] })
            }
        }
    }

    const sortResult = result.filter((item) => {
        const key = Object.keys(item)[0]
        if (item[key].length >= 3) {
            return item
        }
    })

    return sortResult
}

export const getList = () => {
    const list = fs.readdirSync(uploadPath)
    return list
}

export const transferXlsxToJson = (query) => {
    const filePath = path.join(uploadPath, query)
    const workSheetsFromFile = xlsx.parse(filePath);
    const head = workSheetsFromFile[0].data[0];
    const body = workSheetsFromFile[0].data.slice(1);

    const jsonData = []
    for (const item of body) {
        const data = {}
        for (let i = 0; i < head.length; i++) {
            data[head[i]] = item[i] || ""
        }
        jsonData.push(data)
    }

    return jsonData;
}