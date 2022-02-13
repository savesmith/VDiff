import { getMethodPattern } from "./comparer";
import { buildTextFromRegex } from "./regex-util";

export class Signature {
    name: string;
    version: number;
    raw: string;

    private constructor(name: string, version: number, raw: string) {
        this.name = name;
        this.version = version;
        this.raw = raw;
    }
    static createFrom(expr: string) {
        const regex = new RegExp(getMethodPattern().signature);
        const match = expr.match(regex);
        if (match !== null) {
            const version : string = match[2];
            let versionNum : number;
            if(version === "") {
                versionNum = 0;
            } else {
                versionNum = parseInt(version);
            }
            const signature = new Signature(match[1], versionNum, expr);
            console.debug("Signature Created", {
                signature,
                signaturePattern: getMethodPattern().signature
            });
            return signature;
        }
        else {
            return null;
        }
    }
    static removeVersion(expr: string) {
        try {
            return buildTextFromRegex(expr, new RegExp(getMethodPattern().version), getMethodPattern().versionExtraction);
        }
        catch {
            return expr;
        }
    }
    toString() {
        return "Name: " + this.name + ", Version: " + this.version;
    }
    equals(other : Signature | undefined) {
        if(!other) {
            return false;
        }

        return other.name == this.name &&
            other.version == this.version;
    }
}