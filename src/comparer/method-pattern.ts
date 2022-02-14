import { WorkspaceConfiguration } from "vscode";

export class MethodPattern {
    filetype: string;
    signature: string;
    description: string | undefined;
    version: string;
    versionExtraction: string;
    files: Array<string> | string | undefined;

    constructor(
        filetype: string, 
        signature: string,
        version: string,
        versionExtraction: string,
        description?: string,
        files?: Array<string> | string) {
        this.filetype = filetype;
        this.signature = signature;
        this.description =  description;
        this.version =  version;
        this.versionExtraction = versionExtraction;
        this.files = files;
    }

    static getPatternsForFile(file : string, config : WorkspaceConfiguration) {
        const patterns = config.get<Array<MethodPattern>>("methodPatterns");
        return patterns?.filter(pattern => file.includes(pattern.filetype));
    }
}