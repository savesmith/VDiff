import * as assert from 'assert';
import { SourceCode } from 'eslint';

const testFolder = "../../../test_data";
import fs = require('fs');
import path = require('path');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import * as vdiff from '../../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    const testFolderPath = path.join(__dirname, testFolder);
    const tests = fs.readdirSync(testFolderPath);
    tests.forEach(test_folder => {
        test('File Is Diffable', async () => {
            const uri = path.join(testFolderPath, test_folder, "in.t");
            await vscode.commands.executeCommand("vdiff.compareSelectedFileVersions", uri);
        });
    });
});
