import * as vscode from "vscode";
import ComparisonProvider from "./provider";

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const scheme = "comparemethodversions";
    const comparisonProvider = new ComparisonProvider(); 
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, comparisonProvider));

    const disposable = vscode.commands.registerTextEditorCommand("comparemethodversions.compareVersions", async () => {
        if (!vscode.window.activeTextEditor) {
            throw new Error("Requires an active text editor");
        }
        const { document } = vscode.window.activeTextEditor;

        const prevURI = comparisonProvider.getUri(scheme, document.uri, "PREV");
        const currURI = comparisonProvider.getUri(scheme, document.uri, "CURRENT");

        await vscode.workspace.openTextDocument(prevURI);
        await vscode.workspace.openTextDocument(currURI);

        vscode.commands.executeCommand("vscode.diff", prevURI, currURI);

    });

    context.subscriptions.push(disposable);
}
