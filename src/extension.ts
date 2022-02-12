import * as vscode from 'vscode';
import { compareMethodVersions } from './comparer';
import ComparisonProvider from './provider';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "athenacomparemethodversions" is now active!');

	const scheme = "athenacomparemethodversions";
	const comparisonProvider = new ComparisonProvider(); 
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(scheme, comparisonProvider));

	let disposable = vscode.commands.registerTextEditorCommand('athenacomparemethodversions.compareVersions', async () => {
        if (!vscode.window.activeTextEditor) {
			throw new Error("Need an active editor");
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

export function deactivate() {}
