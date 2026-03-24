import { execSync } from "child_process";
process.chdir(new URL(".", import.meta.url).pathname.slice(1));
execSync("npx next dev --turbopack --port 3000", { stdio: "inherit" });
