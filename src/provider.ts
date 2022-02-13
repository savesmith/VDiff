import * as vscode from "vscode";
import { compareMethodVersions } from "./comparer/comparer";

export default class ComparisonProvider implements vscode.TextDocumentContentProvider {
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    
    public getUri(scheme : string, uri : vscode.Uri, type : string) : vscode.Uri {
        const fileExtensionIndex = uri.path.lastIndexOf(".");
        const path = uri.path.substring(0, fileExtensionIndex) + "_" + type + uri.path.substring(fileExtensionIndex);
        return vscode.Uri.from({ scheme: scheme, path: path });
    }
    /**
     *
     * @param {vscode.Uri} uri - a fake uri
     * @returns {string} - text
     **/
    public provideTextDocumentContent (uri : vscode.Uri) : string {
        if (!vscode.window.activeTextEditor) {
            throw new Error("Need an active editor");
        }
        const { document } = vscode.window.activeTextEditor;
        const versions = compareMethodVersions(uri.path, document.getText());

        if(uri.path.includes("PREV")) {
            return versions.before;
        }
        if(uri.path.includes("CURRENT")) {
            return versions.after;
        }
        return "ERROR!";
    }
}