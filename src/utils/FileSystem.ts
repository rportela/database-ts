import * as fs from "fs";
export default function readDirectory(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err: any, files: string[]) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}
