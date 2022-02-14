import * as vscode from "vscode";
import ComparisonProvider from "./provider";

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const scheme = "vdiff";
    const comparisonProvider = new ComparisonProvider(); 

    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, comparisonProvider));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand("vdiff.compareActiveFileVersions", async () => {
        if (!vscode.window.activeTextEditor) {
            throw new Error("Requires an active text editor");
        }
        const { document } = vscode.window.activeTextEditor;

        await comparisonProvider.setDocument(document.uri);

        const prevURI = comparisonProvider.getUri(scheme, document.uri, "PREV");
        const currURI = comparisonProvider.getUri(scheme, document.uri, "CURRENT");

        await vscode.workspace.openTextDocument(prevURI);
        await vscode.workspace.openTextDocument(currURI);

        vscode.commands.executeCommand("vscode.diff", prevURI, currURI);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("vdiff.compareSelectedFileVersions", async (fileUri: vscode.Uri) => {
        try {
            await comparisonProvider.setDocument(fileUri);

            const prevURI = comparisonProvider.getUri(scheme, fileUri, "PREV");
            const currURI = comparisonProvider.getUri(scheme, fileUri, "CURRENT");

            await vscode.workspace.openTextDocument(prevURI);
            await vscode.workspace.openTextDocument(currURI);

            vscode.commands.executeCommand("vscode.diff", prevURI, currURI);
        }
        catch (error) {
            let message = "Unknown Error";
            if(error instanceof Error) message = error.message;
            vscode.window.showErrorMessage(message);
        }
    }));
}
