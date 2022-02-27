import * as vscode from "vscode";
import { throwError } from "../comparer/error-util";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const commentPattern = require("comment-patterns");

export const getFileText = async (uri: vscode.Uri) => {
    let document;
    await vscode.workspace.openTextDocument(uri.path).then(doc => {
        document = doc.getText();
    });
    return document ?? throwError("Unable to read file: " + uri.path.toString());
};

export const createSingleLineComment = (fileName: string, message: string) : string | undefined => {
    try {
        const extension_start = fileName.lastIndexOf(".");
        if(fileName.substring(extension_start) == ".t") {
            // use default language, TODO: let user configure but for now it is perl
            fileName = fileName.substring(0, extension_start) + ".pm";
        }
        const pattern = commentPattern(fileName);
        return pattern.singleLineComment[0].start + " " + message;
    }
    catch (_e) {
        const e:Error = _e as Error;
        throwError(e.message);
    }

};