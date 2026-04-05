import * as path from "path";
import * as fs from "fs";
import { input, print, writeTemplateFile } from "./cli";

const presentationTemplates = import.meta.glob("./templates/presentation/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const libTemplates = import.meta.glob("./templates/lib/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

async function writeTemplates(
  templates: Record<string, string>,
  templateRoot: string,
  projectDir: string,
  params: Record<string, string>,
) {
  for (const [templatePath, content] of Object.entries(templates)) {
    const relativePath = templatePath
      .slice(templateRoot.length + 1);
    const outputPath = path.join(projectDir, relativePath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await writeTemplateFile(outputPath, content, params);
  }
}

async function main() {
  try {
    const isLib = process.argv.includes("--lib");
    const typeLabel = isLib ? "library" : "presentation";

    print(`This utility will help you create a new Presenter.js ${typeLabel}.\n`);

    let projectName = (await input(`${typeLabel} name: (${typeLabel}) `))
      .replace(/\s+/g, "-")
      .toLowerCase();
    if (projectName === "") {
      projectName = typeLabel;
    }

    const cwd = process.cwd();
    const projectDir = path.join(cwd, projectName);

    if (fs.existsSync(projectDir)) {
      throw new Error(`Directory '${projectName}' already exists.`);
    }

    print(`Creating a new Presenter.js ${typeLabel} in ${projectName}...`);

    const templates = isLib ? libTemplates : presentationTemplates;
    const templateRoot = isLib ? "./templates/lib" : "./templates/presentation";
    await writeTemplates(templates, templateRoot, projectDir, { projectName });

    print("Installing dependencies...");
    require("child_process").execSync(`cd ${projectName} && npm install`, {
      stdio: "inherit",
    });

    print(
      `\n\x1b[32mSuccess! Created ${typeLabel} "${projectName}" at ${projectDir}\x1b[0m`,
    );
    print(`\nTo run your ${typeLabel}, run:`);
    print(`\n  $ cd ${projectName}`);
    print(isLib ? "\n  $ npm run build" : "\n  $ npm run serve");
    print("\n");
  } catch (error) {
    console.error();
    console.error(error);
  }
}

main();
