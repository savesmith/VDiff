export const standardize = (content : string) => {
    return content.replace(/(\r\n)|\r/g, "\n");
};
export const captureAs = (regex: string, name: string) => {
    return "(?<" + name + ">" + regex + ")";
};
export const getNamedCaptures = (expr: string, regex: string | RegExp) => {
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
export const sanitize = (expr: string) => {
    let re = /[-.+*?[^\]$(){}=!<>|:\\]/gi;
    expr = expr.replace(re, "\\$&");
    return expr;
};