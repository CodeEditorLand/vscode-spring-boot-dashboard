
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as cp from "child_process";
import * as path from "path";
import * as os from "os";

import { downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath, runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
    try {

        const vscodeExecutablePath = await downloadAndUnzipVSCode();

        /**
         * Install dependency extensions
         */
        const [cli, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);
        cp.spawnSync(cli, [...args, '--install-extension', 'pivotal.vscode-spring-boot'], {
            encoding: 'utf-8',
            stdio: 'inherit'
        });

        cp.spawnSync(cli, [...args, '--install-extension', 'redhat.java'], {
            encoding: 'utf-8',
            stdio: 'inherit'
        });

        cp.spawnSync(cli, [...args, '--install-extension', 'vscjava.vscode-java-debug'], {
            encoding: 'utf-8',
            stdio: 'inherit'
        });

        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath: string = path.resolve(__dirname, "../../");

        // The path to the extension test script
        // Passed to --extensionTestsPath
        const extensionTestsPath: string = path.resolve(__dirname, "./suite/index");

        // Download VS Code, unzip it and run the integration test
        await runTests({
            vscodeExecutablePath,
            extensionDevelopmentPath,
            extensionTestsPath
        });

        process.exit(0);

    } catch (err) {
        process.stdout.write(`${err}${os.EOL}`);
        process.exit(1);
    }
}

main();
