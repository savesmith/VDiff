import { listenerCount } from "process";
import { setFlagsFromString } from "v8";

class Method {
    signature: Signature;
    code: Code;

    constructor(signature: Signature, code : Code) {
        this.signature = signature;
        this.code = code;
    }

    toString() {
        let value = "###########\n";
        value += "Method\n";
        value += this.signature + "\n";
        value += this.code + "\n";
        value += "###########\n";
        return value;
    }
}
class Signature {
    name: string;
    version: number;

    constructor(name: string, version: number) {
        this.name = name;
        this.version = version;
    }
    static createFrom(expr: string) {
        var regex = /sub ([A-Za-z_]*)(\d*)\s/;
        var match = expr.match(regex);
        if (match !== null) {
            let version : string = match[2];
            let versionNum : number;
            if(version === "") {
                versionNum = 0;
            } else {
                versionNum = parseInt(version);
            }
            return new Signature(match[1], versionNum);
        }
        else {
            return null;
        }
    }
    static removeVersion(expr: string) {
        var regex = /(.*sub [A-Za-z_]*)(\d*)(\s.*)/;
        var match = expr.match(regex);

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
}
class Code {
    braces: number = 0;
    started: boolean = false;
    code: string = "";
    completed: boolean = false;

    addCode(code: string) {
        if(this.completed) {
            throw new Error("Code is completed");
        }

        let newCode = "";
        let index = 0;
        for(let character of code) {
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
            }
            index +=1;
        }
        this.code += newCode;

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
        let signature = Signature.createFrom(line);
        if(signature) {
            method = new Method(signature, new Code());
            line = Signature.removeVersion(line);
        }
    }

    if(method) {
        if(!method.code.completed) {
            leftover = method.code.addCode(leftover + "\n" + line);
        }

        if(method.code.completed) {
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

const processFile = (file : string | Array<string>) => {
    if(typeof file === "string") {
        file = file.split("\n");
    }

    let methods = new Array<Method>();
    let method : Method | null = null;
    let comments = "";
    let leftover = "";

    for(let line of file) {
        line = line.trimEnd();
        let result = processLine(line, method, leftover, methods);
        method = result.method;
        methods = result.methods;
        leftover = result.leftover;
    }

    return methods;
};

const organizeMethods = (methods : Array<Method>) => {
    // Organize method versions so we can grab the top two
    let organizedMethods : { [key: string] : Array<Method> } = {};
    for(let method of methods) {
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
        let methodsA = organizedMethods[a];
        let methodsB = organizedMethods[b];
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

export const compareMethodVersions = (document : string) => {
    let methods = processFile(document);
    let organizedMethods = organizeMethods(methods);

    let before = "";
    let after = "";

    for(let key of organizedMethods.keys) {
        let method = organizedMethods.methods[key];
        after += method[0].code.code;
        if(method.length > 1) {
            before += method[1].code.code;
        }
    }
    return {
        before,
        after
    };
};