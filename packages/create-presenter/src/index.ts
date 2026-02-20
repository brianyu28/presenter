import * as path from "path";
import { createDirectory, input, print, writeTemplateFile } from "./cli";

import packageTemplate from "./templates/typescript/package.json?raw";
import htmlTemplate from "./templates/typescript/index.html?raw";
import srcTemplate from "./templates/typescript/src/index.ts.template?raw";
import tsConfigTemplate from "./templates/typescript/tsconfig.json?raw";
import viteConfigTemplate from "./templates/typescript/vite.config.ts?raw";

async function main() {
  try {
    const cwd = process.cwd();
    print("This utility will help you create a new Presenter.js presentation.\n");

    let projectName = (await input("presentation name: (presentation) "))
      .replace(/\s+/g, "-")
      .toLowerCase();
    if (projectName === "") {
      projectName = "presentation";
    }

    print(`Creating a new Presenter.js presentation in ${projectName}...`);
    await createDirectory(projectName);
    await createDirectory(path.join(projectName, "src"));

    await writeTemplateFile(path.join(cwd, projectName, "package.json"), packageTemplate, {
      projectName,
    });
    await writeTemplateFile(path.join(cwd, projectName, "tsconfig.json"), tsConfigTemplate, {});
    await writeTemplateFile(path.join(cwd, projectName, "vite.config.ts"), viteConfigTemplate, {});
    await writeTemplateFile(path.join(cwd, projectName, "index.html"), htmlTemplate, {});
    await writeTemplateFile(path.join(cwd, projectName, "src", "index.ts"), srcTemplate, {});

    print("Installing dependencies...");
    await require("child_process").execSync(`cd ${projectName} && npm install`, {
      stdio: "inherit",
    });

    print(
      `\n\x1b[32mSuccess! Created project "${projectName}" at ${path.join(cwd, projectName)}\x1b[0m`,
    );
    print("\nTo run your presentation, run:");
    print(`\n  $ cd ${projectName}`);
    print("\n  $ npm run serve");
    print("\n");
  } catch (error) {
    console.error();
    console.error(error);
  }
}

// Execute the main function
main();
