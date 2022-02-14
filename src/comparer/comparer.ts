import moment = require("moment");
import * as vscode from "vscode";
import { Code } from "./code";
import { throwError } from "./error-util";
import { Method } from "./method";
import { MethodPattern } from "./method-pattern";
import { sanitize} from "./regex-util";
import { Signature } from "./signature";

const config = vscode.workspace.getConfiguration("vdiff");
export let methodPatterns : Array<MethodPattern>;

const processLine = (
    line: string,
    method: Method | null,
    leftover: string,
    methods: Array<Method>,
    methodPatterns: Array<MethodPattern>) 
: {
    method: Method | null,
    leftover: string,
    methods: Array<Method>
 } => {
    if(!method) {
        const signature = Signature.createFrom(line, methodPatterns);
        if(signature) {
            method = new Method(signature, new Code());
            line = method.signature.removeVersion(line);
        }
    }

    if(method) {
        if(!method.code.completed) {
            leftover = method.code.addCode(line);
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

const processFile = (content : string, methodPatterns : Array<MethodPattern>) => {
    content = sanitize(content);
    const lines = content.split("\n");

    let methods = new Array<Method>();
    let method : Method | null = null;
    let leftover = "";

    for(const l in lines) {
        let line = lines[l];
        line = line.trimEnd();

        const count = methods.length;
        const result = processLine(line, method, leftover, methods, methodPatterns);
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
        organizedMethods[method.signature.name] = organizedMethods[method.signature.name].sort((a,b) => {
            const versionType = a.signature.pattern.versionType;
            if(versionType == "date") {
                const a_date = moment(a.signature.version, a.signature.pattern.versionDateFormat);
                const b_date = moment(b.signature.version, b.signature.pattern.versionDateFormat);
                
                return b_date.diff(a_date);
            }
            else if(versionType == "number") {
                const a_num = parseInt(a.signature.version);
                const b_num = parseInt(b.signature.version);

                return b_num - a_num;
            }
            else if(versionType == "string") {
                b.signature.version.localeCompare(a.signature.version);
            }
            return -1;
        });
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
    filename : string,
    document : string
) => {
    setMethodPattern(MethodPattern.getPatternsForFile(filename, config) ?? throwError("No method pattern defined for this file type"));
    if(!methodPatterns) {
        vscode.window.showInformationMessage("No method pattern found for this file");
        return;
    }

    const methods = processFile(document, methodPatterns);
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

export const setMethodPattern = (patterns : Array<MethodPattern>) => {
    methodPatterns = patterns;
};