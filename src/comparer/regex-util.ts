export const sanitize = (content : string) => {
    return content.replace(/(\r\n)|\r/g, "\n");
};
export const extractAndReformat = (
    expr: string, 
    pattern : RegExp,
    template : string) : 
    {
        source : string,
        extract : string
    } =>
{
    const r = expr.match(pattern);
    if(r == null) {
        throw new Error("Expression does not match pattern");
    }
    console.log(r);
    const source = expr.replace(pattern, "");
    const extract = r[0].replace(pattern, template);
    return {
        source,
        extract
    };
};