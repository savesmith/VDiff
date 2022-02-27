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