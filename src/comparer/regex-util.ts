export const sanitize = (content : string) => {
    return content.replace(/(\r\n)|\r/g, "\n");
};
export const captureAs = (regex: string, name: string) => {
    return "(?<" + name + ">" + regex + ")";
};
export const getNamedCaptures = (expr: string, regex: string) => {
    const match = expr.match(regex);
    const groups = match?.groups;
    if(!match || !groups) {
        return null;
    }
    return groups;
};
export const replaceTemplate = (expr: string, replacements: { [key: string]: string}) => {
    for(const r in replacements) {
        expr = expr.replace("$"+r.toUpperCase()+"$", replacements[r]);
    }
    return expr;
};