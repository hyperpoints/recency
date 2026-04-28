import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const distRoot = path.join(repoRoot, "dist");
const allTargets = ["firefox", "chrome", "safari"];
const requestedTarget = process.argv[2];
const targets = requestedTarget ? [requestedTarget] : allTargets;

if (requestedTarget && !allTargets.includes(requestedTarget)) {
	console.error(`Unknown target: ${requestedTarget}`);
	console.error(`Use one of: ${allTargets.join(", ")}`);
	process.exit(1);
}

const baseManifestPath = path.join(repoRoot, "manifest.json");
const baseManifest = JSON.parse(readFileSync(baseManifestPath, "utf8"));
const sharedFiles = ["background.js", "popup.html", "popup.js", "popup.css"];

function manifestForTarget(target) {
	const manifest = structuredClone(baseManifest);

	if (target === "firefox") {
		manifest.background = { scripts: ["background.js"] };
		manifest.browser_specific_settings = {
			gecko: {
				id: baseManifest.browser_specific_settings?.gecko?.id ?? "move-tab-top@yourname.dev",
			},
		};
		return manifest;
	}

	// Chrome and Safari builds use service worker style background
	manifest.background = { service_worker: "background.js" };
	delete manifest.browser_specific_settings;
	return manifest;
}

rmSync(distRoot, { recursive: true, force: true });

for (const target of targets) {
	const outDir = path.join(distRoot, target);
	mkdirSync(outDir, { recursive: true });

	for (const file of sharedFiles) {
		const from = path.join(repoRoot, file);
		if (!existsSync(from)) {
			console.error(`Missing source file: ${file}`);
			process.exit(1);
		}
		cpSync(from, path.join(outDir, file));
	}

	const manifest = manifestForTarget(target);
	writeFileSync(
		path.join(outDir, "manifest.json"),
		`${JSON.stringify(manifest, null, 2)}\n`,
		"utf8",
	);
}

console.log(`Built targets: ${targets.join(", ")}`);
