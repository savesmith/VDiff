import * as RegexUtil from "../../comparer/regex-util"; 
import * as assert from 'assert';

suite('Extension Test Suite', () => {
    test('should build string from regex and template', () => {
        const expr = "pub Modify20211111 {";
        const result = RegexUtil.extractAndReformat(
            expr, 
            /(\d{4})(\d{2})(\d{2})/,
            "# $2/$3/$1");

        assert.strictEqual(result.extract, "# 11/11/2021");
        assert.strictEqual(result.source, "pub Modify {");
    });
});