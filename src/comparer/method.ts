import { createSingleLineComment } from "../util/file-util";
import { Code } from "./code";
import { Signature } from "./signature";

export class Method {
    signature: Signature;
    code: Code;
    description: string;
    filename: string;
    isExternal: boolean;

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
        const pattern = this.signature.pattern.description+this.signature.raw;
        const matcher = new RegExp(pattern, "m");
        const description = content.match(matcher);
        if(description) {
            this.description = description[1];
            return true;
        }
        return false;
    }
    reformatSignature(expr: string) {
        let info = new Array<string>();
        
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
        let comment = info.reduce((a,b) => a + " | " + b);
        return source + (info.length != 0 ? "  " + createSingleLineComment(this.filename, comment) : "");

    }

    getCode(): string {
        let result = "";
        if(this.description) {
            result += "\n" + this.description;
        }
        result += this.code.code;
        return result;
    }
}