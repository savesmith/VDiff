import { methodPattern } from "./comparer";
import { extractAndReformat } from "./regex-util";
import * as log from "./log";
import { MethodPattern } from "./method-pattern";


export class Signature {
    name: string;
    version: string;
    raw: string;
    pattern: MethodPattern;

    private constructor(name: string, version: string, raw: string, pattern: MethodPattern) {
        this.name = name;
        this.version = version;
        this.raw = raw;
        this.pattern = pattern;
    }
    static createFrom(expr: string, methodPatterns: Array<MethodPattern>) {
        for(const pattern of methodPatterns) {
            const regex = new RegExp(pattern.signature);
            const match = expr.match(regex);
            if (match !== null) {
                const version : string = match[2];
                const signature = new Signature(match[1], version, expr, pattern);
                log.debug("Signature Created", signature);

                return signature;
            }
        }
        return null;
    }
    static removeVersion(expr: string) {
        try {
            const versionRegex = new RegExp(methodPattern.version);
            const signature = extractAndReformat(expr, versionRegex, methodPattern.versionExtraction);

            return signature.source + signature.extract;
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