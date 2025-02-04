import { fileURLToPath } from "url";
import xlsx from "node-xlsx"
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../upload/patient_list2.xlsx")
export const transferXlsxToJson = () => {
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