import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const artifactsRoot = path.join(repoRoot, "artifacts");
const sourceZipPath = path.join(artifactsRoot, "source.zip");

mkdirSync(artifactsRoot, { recursive: true });
rmSync(sourceZipPath, { force: true });

const excluded = [
	".git/*",
	"dist/*",
	"artifacts/*",
	"node_modules/*",
	"*.DS_Store",
	"**/.DS_Store",
];

const args = ["-r", sourceZipPath, "."];
for (const pattern of excluded) {
	args.push("-x", pattern);
}

try {
	execFileSync("zip", args, {
		cwd: repoRoot,
		stdio: "ignore",
	});
} catch (error) {
	console.error("Failed to create source archive. Ensure the 'zip' CLI is installed.");
	process.exit(1);
}

if (!existsSync(sourceZipPath)) {
	console.error("Source archive was not created.");
	process.exit(1);
}

if (readdirSync(artifactsRoot).length === 0) {
	console.error("Artifacts folder is empty.");
	process.exit(1);
}

console.log("Created source archive: artifacts/source.zip");
