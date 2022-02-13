import * as vscode from "vscode";
import { sanitize } from "./comparer/RegexUtil";
const config = vscode.workspace.getConfiguration("compareMethodVersionSettings");

export const patterns = {
    methodSignaturePattern: config.get<string>("methodSignature") ?? "",
    methodDescriptionPattern: config.get<string>("methodDescription") ?? ""
};

export class Method {
    signature: Signature;
    code: Code;
    description: string;

    trySetDescription(content: string) {
        const pattern = patterns.methodDescriptionPattern+this.signature.raw;
        const matcher = new RegExp(pattern, "m");
        const description = content.match(matcher);
        if(description) {
            this.description = description[1];
            return true;
        }
        return false;
    }

    constructor(
        signature: Signature,
        code : Code) {
        this.signature = signature;
        this.code = code;
        this.description = "";
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
        const regex = patterns.methodSignaturePattern;
        const match = expr.match(regex);
        if (match !== null) {
            const version : string = match[2];
            let versionNum : number;
            if(version === "") {
                versionNum = 0;
            } else {
                versionNum = parseInt(version);
            }
            return new Signature(match[1], versionNum, expr);
        }
        else {
            return null;
        }
    }
    static removeVersion(expr: string) {
        const regex = /(.*sub [A-Za-z_]*)(\d*)(\s.*)/;
        const match = expr.match(regex);

        if (match === null) {
            return expr;
        }
        else {
            return (match[1] + match[3] + " # " + match[2]); 
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
export class Code {
    braces = 0;
    started = false;
    code = "";
    completed = false;

    addCode(code: string) {
        if(this.completed) {
            throw new Error("Code is completed");
        }

        let newCode = "";
        let index = 0;
        const addNewLine = this.started;
        for(const character of code) {
            newCode += character;
            if(character === "{") {
                this.braces += 1;
                this.started = true;
            }
            if(character === "}") {
                this.braces -= 1;
            }
            if(this.started && this.braces === 0) {
                this.completed = true;
                newCode += "\n";
            }
            index +=1;
        }
        this.code += (addNewLine ? "\n" : "") + newCode;

        if(index !== code.length) {
            return this.code.substring(index);
        }
        return "";
    }
    toString() {
        return "Code: " + this.code;
    }
}
const processLine = (line: string, method: Method | null, leftover: string, methods: Array<Method>) 
: {
    method: Method | null,
    leftover: string,
    methods: Array<Method>
 } => {
    if(!method) {
        const signature = Signature.createFrom(line);
        if(signature) {
            method = new Method(signature, new Code());
            line = Signature.removeVersion(line);
        }
    }

    if(method) {
        if(!method.code.completed) {
            console.log("line: ",JSON.stringify(line));
            leftover = method.code.addCode(line);
        }

        if(method.code.completed) {
            console.log("method: ", JSON.stringify(method.getCode()));
            methods.push(method);
            method = null;
        }
    }
    return {
        method,
        leftover,
        methods
    };
};

const processFile = (content : string) => {
    content = sanitize(content);
    const lines = content.split("\n");

    let methods = new Array<Method>();
    let method : Method | null = null;
    let leftover = "";

    for(const l in lines) {
        let line = lines[l];
        line = line.trimEnd();

        const count = methods.length;
        const result = processLine(line, method, leftover, methods);
        if(result.methods.length > count) {
            result.methods[result.methods.length-1].trySetDescription(content);
        }
        method = result.method;
        methods = result.methods;
        leftover = result.leftover;
    }

    return methods;
};

const organizeMethods = (methods : Array<Method>) => {
    // Organize method versions so we can grab the top two
    const organizedMethods : { [key: string] : Array<Method> } = {};
    for(const method of methods) {
        if(!method.signature.name) {
            continue;
        }

        if(!organizedMethods[method.signature.name]) {
            organizedMethods[method.signature.name] = new Array<Method>();
        }
        organizedMethods[method.signature.name].push(method);
        organizedMethods[method.signature.name] = organizedMethods[method.signature.name].sort((a,b) => b.signature.version - a.signature.version);
    }

    // Organize method names so the order of the methods so they're in the same place in the file and duplicates come before singletons 
    let organizedKeys = Object.keys(organizedMethods);
    organizedKeys = organizedKeys.sort((a,b) => {
        const methodsA = organizedMethods[a];
        const methodsB = organizedMethods[b];
        if(methodsA.length !== methodsB.length) {
            return methodsB.length - methodsA.length;
        } else {
            return a.localeCompare(b);
        }
    });
    return {
        methods: organizedMethods,
        keys: organizedKeys
    };
};

export const compareMethodVersions = (
    document : string
) => {
    const methods = processFile(document);
    const organizedMethods = organizeMethods(methods);

    let before = "";
    let after = "";

    for(const key of organizedMethods.keys) {
        const method = organizedMethods.methods[key];
        after += method[0].getCode();
        if(method.length > 1) {
            before += method[1].getCode();
        }
    }
    return {
        before,
        after
    };
};
