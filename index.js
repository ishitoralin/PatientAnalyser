import express from "express"
import http from "http"
import cors from "cors"
import morgan from "morgan"
// import parser from "body-parser"
import os from "os"
import routerList from "./src/router.js"

const app = express()
const server = http.createServer(app)

app.use(cors());
app.use(morgan('dev'));
// app.use(parser.json())

app.use("/", routerList)

const port = process.env.PORT || 3000
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost";
};

const hostname = getLocalIP();
const protocol = "http";

server.listen(port, () => {
    console.log(`Server is running on ${protocol}://${hostname}:${port}`);
});