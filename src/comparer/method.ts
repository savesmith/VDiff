import { Code } from "./code";
import { Signature } from "./signature";

export class Method {
    signature: Signature;
    code: Code;
    description: string;

    constructor(
        signature: Signature,
        code : Code) {
        this.signature = signature;
        this.code = code;
        this.description = "";
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

    getCode(): string {
        let result = "";
        if(this.description) {
            result += "\n" + this.description;
        }
        result += this.code.code;
        return result;
    }
}