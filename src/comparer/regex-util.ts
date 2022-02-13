export const sanitize = (content : string) => {
    return content.replace(/(\r\n)|\r/g, "\n");
};
export const buildTextFromRegex = (
    expr: string, 
    pattern : RegExp,
    template : string) : string =>
{
    const r = expr.match(pattern);
    if(r == null) {
        throw new Error("Expression does not match pattern");
    }
    return template.replace(/(?:\\)?(\$(\d))/gm, (match, input, index) => {
        if(match.includes("\\")) {
            return input;
        }
        return r[parseInt(index)];
    });
};