import { WorkspaceConfiguration } from "vscode";

export class MethodPattern {
    filetype: string;
    signature: string;
    description: string | undefined;
    version: string;
    versionExtraction: string;
    compareWith: Array<string> | undefined;

    constructor(
        filetype: string, 
        signature: string,
        version: string,
        versionExtraction: string,
        description?: string,
        compareWith?: Array<string>) {
        this.filetype = filetype;
        this.signature = signature;
        this.description =  description;
        this.version =  version;
        this.versionExtraction = versionExtraction;
        this.compareWith = compareWith;
    }

    static getPatternsForFile(file : string, config : WorkspaceConfiguration) {
        const patterns = config.get<Array<MethodPattern>>("methodPatterns");
        return patterns?.find(pattern => file.includes(pattern.filetype));
    }
}