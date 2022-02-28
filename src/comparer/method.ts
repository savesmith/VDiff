import { createSingleLineComment } from "../util/file-util";
import { Code } from "./code";
import { captureAs, getNamedCaptures, sanitize } from "./regex-util";
import { Signature } from "./signature";

export class Method {
    signature: Signature;
    code: Code;
    description: string;
    filename: string;
    isExternal: boolean;
    versionInfo: string | undefined;

    constructor(
        signature: Signature,
        code : Code,
        filename: string,
        isExternal: boolean) {
        this.signature = signature;
        this.code = code;
        this.description = "";
        this.filename = filename;
        this.isExternal = isExternal;
    }

    trySetDescription(content: string) {
        try {
            if(!this.signature.pattern.description) {
                return;
            }

            const pattern = captureAs(this.signature.pattern.description, "description")+sanitize(this.signature.raw);
            const values = getNamedCaptures(content, new RegExp(pattern, "m"));
            if(values) {
                this.description = values.description;
                return true;
            }
            return false;
        } 
        catch (_e) {
            const e = _e as Error;
            // Todo: log error here
            return false;
        }
    }
    addReformatedSignature(expr: string) {
        const info = new Array<string>();
        
        if(this.isExternal) {
            info.push(this.filename);
        }

        // Version
        const {
            source,
            extract
        } = this.signature.extractVersion(expr);

        if(extract) {
            info.push(extract);
        }
        this.versionInfo = info.reduce((a,b) => a + " | " + b);
        this.code.addSignature(source + "\n");
    }

    getCode(): string {
        let result = "";
        if(this.description) {
            result += this.description.trimEnd() + "\n";
        }
        if(this.versionInfo) {
            result += createSingleLineComment(this.filename, this.versionInfo) + "\n";
        }
        result += this.code.code;
        result = result.trimEnd() + "\n\n";
        return result;
    }
}