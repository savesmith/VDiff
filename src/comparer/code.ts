export class Code {
    braces = 0;
    started = false;
    code = "";
    completed = false;

    addSignature(code: string) {
        let newCode = "";
        let oneLiner = false;
        for(const character of code) {
            newCode += character;
            if(character === "{") {
                this.braces += 1;
                oneLiner = true;
            }
            if(character === "}") {
                this.braces -= 1;
            }
        }
        oneLiner = oneLiner && this.braces === 0;
        if(oneLiner) {
            this.completed = true;
        }
        else if(this.braces > 0) {
            this.started = true;
        }

        this.code += newCode;
    }
    addCode(code: string) {
        if(this.completed) {
            throw new Error("Code is completed");
        }

        let newCode = "";
        let index = 0;
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
                newCode += (index+1 != code.length ? code.substring(index+1) : "");
                break;
            }
            index +=1;
        }
        this.code += newCode;

        return "";
    }
    toString() {
        return "Code: " + this.code;
    }
}