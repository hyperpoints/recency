import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
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
const sharedFiles = ["background.js", "popup.html", "popup.js", "popup.css", "icons"];

function manifestForTarget(target) {
	const manifest = structuredClone(baseManifest);

	if (target === "firefox") {
		const gecko = {
			...(baseManifest.browser_specific_settings?.gecko ?? {}),
		};

		if (!gecko.id) {
			gecko.id = "tab-stack@hyperpoints.dev";
		}

		manifest.background = { scripts: ["background.js"] };
		manifest.browser_specific_settings = {
			gecko,
		};
		return manifest;
	}

	// Chrome and Safari builds use service worker style background
	manifest.background = { service_worker: "background.js" };
	delete manifest.browser_specific_settings;
	return manifest;
}

mkdirSync(distRoot, { recursive: true });

for (const target of targets) {
	const outDir = path.join(distRoot, target);
	rmSync(outDir, { recursive: true, force: true });
	mkdirSync(outDir, { recursive: true });

	for (const file of sharedFiles) {
		const from = path.join(repoRoot, file);
		if (!existsSync(from)) {
			console.error(`Missing source file: ${file}`);
			process.exit(1);
		}

		if (statSync(from).isDirectory()) {
			cpSync(from, path.join(outDir, file), { recursive: true });
		} else {
			cpSync(from, path.join(outDir, file));
		}
	}

	const manifest = manifestForTarget(target);
	writeFileSync(
		path.join(outDir, "manifest.json"),
		`${JSON.stringify(manifest, null, 2)}\n`,
		"utf8",
	);
}

console.log(`Built targets: ${targets.join(", ")}`);
