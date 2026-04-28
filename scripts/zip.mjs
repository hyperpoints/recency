import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const distRoot = path.join(repoRoot, "dist");
const artifactsRoot = path.join(repoRoot, "artifacts");
const allTargets = ["firefox", "chrome", "safari"];
const requestedTarget = process.argv[2];
const targets = requestedTarget ? [requestedTarget] : allTargets;

if (requestedTarget && !allTargets.includes(requestedTarget)) {
	console.error(`Unknown target: ${requestedTarget}`);
	console.error(`Use one of: ${allTargets.join(", ")}`);
	process.exit(1);
}

if (!existsSync(distRoot)) {
	console.error("dist/ does not exist. Run a build first.");
	process.exit(1);
}

mkdirSync(artifactsRoot, { recursive: true });

for (const target of targets) {
	const sourceDir = path.join(distRoot, target);

	if (!existsSync(sourceDir)) {
		console.error(`Missing build output: dist/${target}`);
		process.exit(1);
	}

	if (readdirSync(sourceDir).length === 0) {
		console.error(`Build output is empty: dist/${target}`);
		process.exit(1);
	}

	const zipPath = path.join(artifactsRoot, `${target}.zip`);
	rmSync(zipPath, { force: true });

	try {
		execFileSync("zip", ["-r", zipPath, "."], {
			cwd: sourceDir,
			stdio: "ignore",
		});
	} catch (error) {
		console.error("Failed to create zip archive. Ensure the 'zip' CLI is installed.");
		process.exit(1);
	}
}

console.log(`Created archives: ${targets.map((target) => `artifacts/${target}.zip`).join(", ")}`);
