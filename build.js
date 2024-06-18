const fs = require("fs");
const path = require("path");

const directory = "./dist"; // Update this path to your output directory

function addJsExtension(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(
    /(import .* from\s+['"])(\.\/.*)(?=['"])/g,
    "$1$2.js"
  );
  content = content.replace(
    /(export .* from\s+['"])(\.\/.*)(?=['"])/g,
    "$1$2.js"
  );
  fs.writeFileSync(filePath, content, "utf8");
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".js")) {
      addJsExtension(fullPath);
    }
  }
}

processDirectory(directory);
console.log("Added .js extensions to import paths.");
