const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();

const sourceTargets = [
  "index.html",
  "views/index.html",
  "src",
  "scripts",
  "package.json",
].map((target) => path.join(projectRoot, target));

const forbiddenSourcePatterns = [
  /\/v1\/high-scores/g,
  /\/v1\/controls/g,
  /node\s+app\.js/g,
  /express\b/g,
];

const staticAssetAllowlist = new Set([
  ".js",
  ".css",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".webp",
  ".avif",
  ".mp3",
  ".wav",
  ".ogg",
  ".json",
  ".webmanifest",
  ".woff",
  ".woff2",
  ".ttf",
]);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walkFiles(targetPath, list = []) {
  if (!fs.existsSync(targetPath)) {
    return list;
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    list.push(targetPath);
    return list;
  }

  const entries = fs.readdirSync(targetPath, { withFileTypes: true });
  for (const entry of entries) {
    const childPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "dist" ||
        entry.name === "node_modules" ||
        entry.name === ".git"
      ) {
        continue;
      }
      walkFiles(childPath, list);
    } else if (entry.isFile()) {
      list.push(childPath);
    }
  }

  return list;
}

function checkSourceForForbiddenPatterns() {
  const allSourceFiles = sourceTargets.flatMap((target) => walkFiles(target));
  const failures = [];

  for (const filePath of allSourceFiles) {
    let text;
    try {
      text = readText(filePath);
    } catch (error) {
      continue;
    }

    for (const pattern of forbiddenSourcePatterns) {
      const match = text.match(pattern);
      if (match) {
        failures.push(
          `${path.relative(projectRoot, filePath)}: found forbidden pattern ${pattern}`,
        );
      }
    }
  }

  return failures;
}

function checkBuildArtifacts() {
  const distDir = path.join(projectRoot, "dist");
  const distIndex = path.join(distDir, "index.html");
  const failures = [];

  if (!fs.existsSync(distDir) || !fs.existsSync(distIndex)) {
    failures.push(
      "dist output not found. Run `npm run build` before `npm run check:static-arch`.",
    );
    return failures;
  }

  const distFiles = walkFiles(distDir);

  for (const filePath of distFiles) {
    const textExt = path.extname(filePath);
    if (
      ![".html", ".js", ".css", ".json", ".webmanifest", ".map"].includes(
        textExt,
      )
    ) {
      continue;
    }

    let text;
    try {
      text = readText(filePath);
    } catch (error) {
      continue;
    }

    if (/\/v1\/high-scores|\/v1\/controls/.test(text)) {
      failures.push(
        `${path.relative(projectRoot, filePath)}: build artifact references forbidden runtime API endpoint.`,
      );
    }

    if (/node\s+app\.js|express\b/.test(text)) {
      failures.push(
        `${path.relative(projectRoot, filePath)}: build artifact references server runtime dependency.`,
      );
    }
  }

  const distHtml = readText(distIndex);
  const srcMatches = [
    ...distHtml.matchAll(/(?:src|href)=['"]([^'"]+)['"]/g),
  ].map((match) => match[1]);

  for (const assetRef of srcMatches) {
    if (
      assetRef.startsWith("mailto:") ||
      assetRef.startsWith("tel:") ||
      assetRef.startsWith("#") ||
      assetRef.startsWith("data:")
    ) {
      continue;
    }

    if (/^https?:\/\//i.test(assetRef)) {
      failures.push(
        `dist/index.html: external asset reference is not allowed for static-only build (${assetRef}).`,
      );
      continue;
    }

    const cleanRef = assetRef.split("?")[0].split("#")[0];
    const ext = path.extname(cleanRef);

    if (!ext || !staticAssetAllowlist.has(ext)) {
      failures.push(
        `dist/index.html: non-static or unknown asset reference (${assetRef}).`,
      );
      continue;
    }

    const relativeAssetPath = cleanRef.startsWith("/")
      ? cleanRef.slice(1)
      : cleanRef;
    const resolved = path.join(distDir, relativeAssetPath);

    if (!fs.existsSync(resolved)) {
      failures.push(
        `dist/index.html: referenced asset missing in dist (${assetRef}).`,
      );
    }
  }

  return failures;
}

function checkPackageScripts() {
  const packagePath = path.join(projectRoot, "package.json");
  const failures = [];

  if (!fs.existsSync(packagePath)) {
    failures.push("package.json not found.");
    return failures;
  }

  const pkg = JSON.parse(readText(packagePath));
  const scripts = pkg.scripts || {};

  for (const [name, value] of Object.entries(scripts)) {
    if (/node\s+app\.js/.test(String(value))) {
      failures.push(
        `package.json scripts.${name} must not require node app.js runtime.`,
      );
    }
  }

  return failures;
}

function run() {
  const failures = [
    ...checkSourceForForbiddenPatterns(),
    ...checkPackageScripts(),
    ...checkBuildArtifacts(),
  ];

  if (failures.length > 0) {
    console.error("Static architecture check failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log("Static architecture check passed.");
}

run();
