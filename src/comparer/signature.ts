import { MethodPattern } from "./method-pattern";
import * as log from "./log";
import { captureAs, getNamedCaptures, replaceTemplate } from "./regex-util";


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
            const values = getNamedCaptures(expr, replaceTemplate(pattern.signature, { name: captureAs(pattern.name, "name"), version: captureAs(pattern.version, "version") }));
            if(values) {
                const signature = new Signature(values.name, values.version, expr, pattern);
                log.debug("Signature Created", signature);
                return signature;
            }
        }
        return null;
    }
    extractVersion(expr: string) {
        try {
            const sigPattern = replaceTemplate(this.pattern.signature, { name: captureAs(this.pattern.name, "name")});
            const versionStart = sigPattern.indexOf("$VERSION$");
            const versionEnd = versionStart + ("$VERSION$").length;

            let re = captureAs(".*" + sigPattern.substring(0, versionStart), "beginning");
            re += captureAs(this.pattern.version, "version");
            re += captureAs((versionEnd <= sigPattern.length ? sigPattern.substring(versionEnd) : "") + ".*", "ending");

            const values = getNamedCaptures(expr, re);
            if(!values) {
                throw new Error("Expression does not match signature pattern");
            }

            const signature = values.beginning+values.ending;
            const version = values.version.replace(new RegExp(this.pattern.version), this.pattern.formattedVersion) + "\n";
            return {
                source: signature,
                extract: version
            };
        }
        catch {
            return {
                source: expr,
                extract: null
            };
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
