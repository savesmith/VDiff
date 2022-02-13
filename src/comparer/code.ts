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