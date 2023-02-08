/**
 * './dist' から './dist-gz' へファイルを再帰的にコピーする。
 * ただし、拡張子が.jsの場合は単純にコピーせずgzip圧縮する (対象拡張子は様子を見て増やす)
 * 参考:
 *  - https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
 *  - https://nodejs.org/api/zlib.html#zlib
 * 単に'cp -r' だったら node16からは fs.cp, fs.cpSync が使える
 */

import fs, { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream";
import { createGzip, createBrotliCompress } from "node:zlib";

const SRCDIR = "../dist";
// const DESTDIR = "../dist-gz";
const DESTDIR = "../dist-br";
const gzList = [".js", ".css", ".svg", ".json"];

fs.rmSync(DESTDIR, { recursive: true, force: true });

const gzipFile = (src, dest) => {
  const gzip = createGzip({ level: 9 });
  const source = createReadStream(src);
  const destination = createWriteStream(dest);
  // console.log(`gzip -9c ${src} > ${dest}`);

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error("An error occurred:", err);
      process.exitCode = 1;
    }
  });
};

const brotliFile = (src, dest) => {
  const br = createBrotliCompress();
  const source = createReadStream(src);
  const destination = createWriteStream(dest);

  pipeline(source, br, destination, (err) => {
    if (err) {
      console.error("An error occurred:", err);
      process.exitCode = 1;
    }
  });
};

const copyRecursiveSync = (src, dest) => {
  let exists = fs.existsSync(src);
  let stats = exists && fs.statSync(src);
  let isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    if (gzList.includes(path.extname(src))) {
      // gzipFile(src, dest);
      brotliFile(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
};

copyRecursiveSync(SRCDIR, DESTDIR);
