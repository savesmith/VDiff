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

export const createSingleLineComment = (fileName: string, message: string) : string => {
    const pattern = commentPattern(fileName);
    return pattern.singleLineComment[0].start + " " + message;

};