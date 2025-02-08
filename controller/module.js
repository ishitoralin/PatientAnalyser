import { fileURLToPath } from "url";
import xlsx from "node-xlsx"
import path from "path";
import * as fs from "fs"
import { handleThrowError } from "./helper.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../upload")
const outputPath = path.join(__dirname, "../outputs")
const initCon = "初診"
const subCon = "複診"
const pidStr = "病歷號碼"
const col5Str = "欄5"
const nameStr = "姓名"
const dateStr = "就診日期"
const drStr = "醫師"

export const getData = (file, subTimes = 0, initOnly = 0) => {
    subTimes = Number(subTimes)
    initOnly = Number(initOnly)
    const list = getList()
    const targetFile = list.filter((item) => item === file)[0]
    if (!targetFile) {
        handleThrowError(404, "File not found")
    }

    const [head, body] = transferXlsxToJson(targetFile)
    // get index
    const col5Index = head.indexOf(col5Str)
    const pidIndex = head.indexOf(pidStr)
    const nameIndex = head.indexOf(nameStr)
    const dateIndex = head.indexOf(dateStr)
    const drIndex = head.indexOf(drStr)

    // filter body
    const filterBody = body.filter((item) => item[col5Index] === initCon || item[col5Index] === subCon)

    // get first time patient
    const firstTimeList = filterBody
        .filter((item) => item[col5Index] === initCon)
        .map((item) => item[pidIndex]);

    // filter first time and multi > 2 patients
    const result = []
    for (const element of filterBody) {
        for (const pid of firstTimeList) {
            if (element[pidIndex] === pid) {
                result.push({ pid: element[pidIndex], name: element[nameIndex], date: element[dateIndex], dr: element[drIndex], col5: element[col5Index] })
                break
            }
        }
    }

    const filterResult = result.sort((a, b) => a["pid"] - b["pid"])
    const pidCount = filterResult.reduce((acc, item) => {
        acc[item["pid"]] = (acc[item["pid"]] || 0) + 1;
        return acc;
    }, {});

    const filteredResult = filterResult.filter(item => pidCount[item["pid"]] >= (subTimes + 1));
    if (!filterResult.length) {
        return []
    }
    // generate new xlsx file
    const data = []
    data.push(Object.keys(filteredResult[0]))
    for (const element of filteredResult) {
        const values = Object.values(element)
        data.push(values)
    }

    const buffer = xlsx.build([{ name: `${file}_filtered`, data: data }])

    const fileOutput = path.join(outputPath, `filtered_${file}`)
    fs.writeFileSync(fileOutput, buffer)
    return data
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

    return [head, body];
}