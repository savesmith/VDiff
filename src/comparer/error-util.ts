import * as vscode from 'vscode';

export const throwError = (errorMessage: string): never => {
    vscode.window.showErrorMessage(errorMessage);
    throw new Error(errorMessage);
};

export const throwUserSettingsError = (errorMessage: string): never => {
    vscode.window.showInformationMessage(errorMessage, "Configure Settings").then(item => {
        if(item) {
            vscode.commands.executeCommand("workbench.action.openSettingsJson");
        }
    });
    throw new Error("Invalid User Settings");
};