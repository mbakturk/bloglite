const { series } = require("gulp");
const del = require("del");
const fs = require("fs");
const copyDir = require("copy-dir");
const { execSync } = require("child_process");
const zipFolder = require("zip-folder");
const moment = require("moment-timezone");
const path = require("path");

const buildVersion = moment().format("YYYYMMDDHHmm");

console.log("Building is started");

const copyFile = (file, target) => {
    fs.copyFileSync(file, path.join(target, file));
}

const readJsonFile = (file) => {
    const filePath = path.join(process.cwd(), file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const writeJsonFile = (filePath, json) => {
    fs.writeFileSync(path.join(process.cwd(), filePath), JSON.stringify(json));
}

const clean = (cb) => {
    del.sync(["package"]);
    fs.mkdirSync("package");

    fs.mkdirSync("package/views");
    fs.mkdirSync("package/public");
    fs.mkdirSync("package/bin");
    fs.mkdirSync("package/admin_panel");

    copyDir.sync("views", "package/views");
    copyDir.sync("public", "package/public");


    copyFile("config.json", "package");

    const packageJson = readJsonFile("package.json");

    packageJson.main = "bin/main.js";
    packageJson.scripts = {
        start: "node bin/main.js"
    }

    delete packageJson.devDependencies;

    writeJsonFile("package/package.json", packageJson);
    cb();
}


const build = (cb) => {
    execSync("npm run build");
    copyDir.sync("dist", "package/bin");    
    execSync("cd admin_panel && npm run build");    
    copyDir.sync("admin_panel/dist", "package/admin_panel");
    cb();
}

const zip = (cb) => {
    const fileName = "bloglite_" + buildVersion + ".zip";
    zipFolder("package", fileName, (err) => {
        if (err) {
            console.log("oh no!", err);
        } else {
            del.sync(["package"]);
            cb();
        }
    });
}

exports.default = series(clean, build, zip);