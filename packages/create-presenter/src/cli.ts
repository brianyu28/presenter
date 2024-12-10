import * as fs from "fs";
import * as readline from "readline";

export function print(message: string, ...params: any[]): void {
  console.log(message, ...params);
}

export async function input(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(prompt, (response) => {
      rl.close();
      resolve(response);
    });
  });
}

export async function createDirectory(directoryName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(directoryName, (error) => {
      if (error) {
        if (error.code === "EEXIST") {
          reject(new Error(`Directory '${directoryName}' already exists.`));
        }
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function writeTemplateFile(
  path: string,
  template: string,
  params: Partial<Record<string, string>>,
): Promise<void> {
  // Replace variables in template with params
  Object.keys(params).forEach((key) => {
    template = template.replace(
      new RegExp(`{{\\s*${key}\\s*}}`, "g"),
      params[key],
    );
  });

  return new Promise((resolve, reject) => {
    fs.writeFile(path, template, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
