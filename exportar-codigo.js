// node exportar-codigo.js .

// node exportar-codigo.js .

const fs = require("fs");
const path = require("path");

const rootDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const scriptPath = path.resolve(__filename);

const SKIP_DIRS = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    ".turbo",
    ".cache",
    "coverage",
    ".parcel-cache",
    ".expo",
    ".angular",
    "vendor"
]);

function shouldSkipPath(fullPath) {
    const base = path.basename(fullPath);
    if (path.resolve(fullPath) === scriptPath) return true;
    if (base === "exportar-codigo.js") return true;
    if (base === "exportar-codigo-lista.js") return true;
    if (base.startsWith("export-codigo") && base.endsWith(".txt")) return true;
    return false;
}

function isInSkippedDir(fullPath) {
    const parts = fullPath.split(path.sep);
    return parts.some((segment) => SKIP_DIRS.has(segment));
}

function isTextFile(filePath) {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size === 0) return true;

        const sampleSize = Math.min(stats.size, 8000);
        const buffer = fs.readFileSync(filePath);
        const slice = buffer.slice(0, sampleSize);

        for (let i = 0; i < slice.length; i++) {
            const byte = slice[i];
            if (byte === 0) return false;
            if (byte < 7 || (byte > 13 && byte < 32)) return false;
        }
        return true;
    } catch {
        return false;
    }
}

const treeLines = [];
const fileList = [];

function walkDir(dir, depth) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const isDir = entry.isDirectory();

        const skipByHierarchy = isInSkippedDir(fullPath);
        const isSkipSpecial = shouldSkipPath(fullPath);
        const skipForCode = skipByHierarchy || isSkipSpecial;

        const indent = " ".repeat(depth * 4);
        const label = skipForCode
            ? `${entry.name} (presente, código no exportado)`
            : entry.name;

        treeLines.push(`${indent}|—${label}`);

        if (isDir) {
            if (!skipForCode) {
                walkDir(fullPath, depth + 1);
            }
        } else {
            if (!skipForCode && isTextFile(fullPath)) {
                fileList.push(fullPath);
            }
        }
    }
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
)}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const header = `// Export generado el: ${now.toLocaleString()}\n\n`;

const rootName = path.basename(rootDir);
walkDir(rootDir, 0);

let output = "";
output += header;
output += "ESQUEMA DE CARPETAS:\n\n";
output += rootName + "\n";
output += treeLines.join("\n") + "\n\n";
output += "//codigo\n\n";

for (const filePath of fileList) {
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf8");

    output += `// ${relPath}\n`;
    output += `// ----- START FILE -----\n`;
    output += content + "\n";
    output += `// ----- END FILE -----\n\n`;
}

const outFileName = `export-codigo-${stamp}.txt`;
const outFile = path.join(rootDir, outFileName);
fs.writeFileSync(outFile, output, "utf8");
console.log(`Archivo generado: ${outFileName}`);
