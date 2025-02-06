import { fileURLToPath } from "url";
import xlsx from "node-xlsx"
import path from "path";
import * as fs from "fs"
import { handleThrowError } from "./helper.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../upload")
const outputPath = path.join(__dirname, "../outputs/hello.xlsx")

export const getData = (file) => {
    const list = getList()
    const targetFile = list.filter((item) => item === file)[0]
    if (!targetFile) {
        handleThrowError(404, "File not found")
    }

    const [head, body] = transferXlsxToJson(targetFile)

    const timesIndex = head.indexOf("欄5")
    console.log(body.length)
    body.filter((item) => item[timesIndex] === "初診" || item[timesIndex] === "複診2")
    console.log(body.length)
    // const jsonData = transferXlsxToJson(targetFile).filter((item) => item["欄5"] === "初診" || item["欄5"] === "複診")
    //     .sort((a, b) => a["病歷號碼"] - (b["病歷號碼"]));

    // const oneTimePatientList = []
    // for (const item of jsonData) {
    //     if (item["欄5"] === "初診") {
    //         oneTimePatientList.push(item["病歷號碼"])
    //     }
    // }

    // const result = []
    // for (const patient of jsonData) {
    //     for (const pid of oneTimePatientList) {
    //         if (patient["病歷號碼"] === pid) {
    //             result.push({ id: patient["病歷號碼"], date: patient["就診日期"], dr: patient["醫師"], status: patient["欄5"] })
    //         }
    //     }
    // }

    // result.sort((a, b) => a.id - b.id);

    // const data = [
    //     [1, 2, 3],
    //     [true, false, null, 'sheetjs'],
    //     ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
    //     ['baz', null, 'qux'],
    // ];
    // const buffer = xlsx.build([{ name: 'mySheetName', data: data }])

    // fs.writeFileSync(outputPath, buffer)
    return body
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

    // const jsonData = []
    // for (const item of body) {
    //     const data = {}
    //     for (let i = 0; i < head.length; i++) {
    //         data[head[i]] = item[i] || ""
    //     }
    //     jsonData.push(data)
    // }

    return [head, body];
}