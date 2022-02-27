import { WorkspaceConfiguration } from "vscode";
import { throwUserSettingsError } from "./error-util";
import preconfig from "../preconfig.json";

export class MethodPattern {
    filetype: string;
    signature: string;
    description: string | undefined;
    version: string;
    versionType: string; // date, number, text
    versionDateFormat: string | undefined; // 'mm_yyyy'
    formattedVersion: string;
    compareWith: Array<string> | undefined;
    files: Array<string> | string | undefined;
    name: string;

    constructor(
        filetype: string, 
        signature: string,
        version: string,
        formattedVersion: string,
        name: string,
        description?: string,
        compareWith?: Array<string>,
        versionType?: string,
        files?: Array<string> | string,
        versionDateFormat?: string) {
        this.filetype = filetype;
        this.signature = signature;
        this.description =  description;
        this.version =  version;
        this.formattedVersion = formattedVersion;
        this.compareWith = compareWith;
        this.files = files;
        this.versionType = versionType ?? "text";
        this.versionDateFormat = versionDateFormat;
        this.name = name;
    }

    static getPatternsForFile(file : string, config : WorkspaceConfiguration) {
        let patterns = config.get<Array<MethodPattern>>("methodPatterns") ?? [];
        patterns = patterns.concat(preconfig.methodPatterns as Array<MethodPattern>);
        patterns = patterns.filter(pattern => file.includes(pattern.filetype));
        for(const pattern of patterns) {
            MethodPattern.validate(pattern);
        }
        if(!patterns.length) {
            throwUserSettingsError("No valid method pattern configuration found for this file type.");
        }
        return patterns;
    }
    static validate(pattern: MethodPattern) {
        if(!["text", "number", "date"].includes(pattern.versionType)) {
            throwUserSettingsError("Invalid versionType. Must one of the values: text, number, date");
        }
        if(pattern.versionType == "date" && !pattern.versionDateFormat) {
            throwUserSettingsError("versionDateFormat is required with the versionType is date");
        }
    }
}