import * as assert from 'assert';
import { compareMethodVersions } from '../../comparer/comparer';
const testFolder = "../../../test_data";
import fs = require('fs');
import path = require('path');

import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    const testFolderPath = path.join(__dirname, testFolder);
    const tests = fs.readdirSync(testFolderPath);
    tests.forEach(test_folder => {
        test(test_folder + ' diffs correctly', async () => {
            const test_file_path = path.join(testFolderPath, test_folder);

            // Get Extension
            let extension = fs.readdirSync(test_file_path)[0];
            extension = extension.substring(extension.lastIndexOf('.'));
            
            const uri = vscode.Uri.file(path.join(test_file_path, "in" + extension));
            const versions = await compareMethodVersions(uri);

            const before = fs.readFileSync(path.join(test_file_path, "out_before" + extension)).toString();
            const after = fs.readFileSync(path.join(test_file_path, "out_after" + extension)).toString();
            assert.strictEqual(versions.before, before, 'Expected Before Output');
            assert.strictEqual(versions.after, after, 'Expected After Output');
        });
    });
});
