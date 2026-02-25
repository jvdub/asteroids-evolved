const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();

function walkFiles(directoryPath, files = []) {
  if (!fs.existsSync(directoryPath)) {
    return files;
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const childPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(childPath, files);
    } else if (entry.isFile()) {
      files.push(childPath);
    }
  }

  return files;
}

function summarizeDirectory(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  const files = walkFiles(absolutePath);

  const withSizes = files
    .map((filePath) => {
      const stat = fs.statSync(filePath);
      return {
        path: path.relative(projectRoot, filePath),
        bytes: stat.size,
      };
    })
    .sort((a, b) => b.bytes - a.bytes);

  const totalBytes = withSizes.reduce((sum, file) => sum + file.bytes, 0);

  return {
    relativePath,
    totalBytes,
    largest: withSizes.slice(0, 10),
  };
}

function printSummary(summary) {
  console.log(`\n[${summary.relativePath}] total bytes: ${summary.totalBytes}`);
  summary.largest.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.bytes} ${entry.path}`);
  });
}

const inputs = ["images", "sounds", "dist/images", "dist/sounds"];

for (const input of inputs) {
  printSummary(summarizeDirectory(input));
}
