/**
 * こんなものが必要なのはMS-Windowsのせい
 */

import fs from "node:fs";

// `rm -rf .terraform/ .terraform.lock.hcl` を実行する。
[".terraform/", ".terraform.lock.hcl", "main_override.tf"].forEach((elem) =>
  fs.rmSync(elem, { recursive: true, force: true })
);

// copy template
fs.copyFileSync("terraform.tfvars-", "terraform.tfvars");
