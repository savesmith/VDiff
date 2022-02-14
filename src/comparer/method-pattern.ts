import { WorkspaceConfiguration } from "vscode";

export class MethodPattern {
    filetype: string;
    signature: string;
    description: string | undefined;
    version: string;
    versionType: string; // date, number, text
    versionDateFormat: string | undefined; // 'mm_yyyy'
    versionExtraction: string;
    files: Array<string> | string | undefined;

    constructor(
        filetype: string, 
        signature: string,
        version: string,
        versionExtraction: string,
        versionType?: string,
        description?: string,
        files?: Array<string> | string,
        versionDateFormat?: string) {
        this.filetype = filetype;
        this.signature = signature;
        this.description =  description;
        this.version =  version;
        this.versionExtraction = versionExtraction;
        this.files = files;
        this.versionType = versionType ?? "text";
        this.versionDateFormat = versionDateFormat;
    }

    static getPatternsForFile(file : string, config : WorkspaceConfiguration) {
        const patterns = config.get<Array<MethodPattern>>("methodPatterns");
        return patterns?.filter(pattern => file.includes(pattern.filetype));
    }
}