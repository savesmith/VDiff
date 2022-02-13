import * as RegexUtil from "../../comparer/RegexUtil"; 
import * as assert from 'assert';

suite('Extension Test Suite', () => {
    test('should build string from regex and template', () => {
        const expr = "pub Modify20211111";
        const newString = RegexUtil.buildTextFromRegex(
            expr, 
            /pub Modify(\d{4})(\d{2})(\d{2})/,
            "$2/$3/$1");

        assert.strictEqual(newString, "11/11/2021");
    });

    test('should allow escaping $', () => {
        const expr = "pub Modify20211111";
        const newString = RegexUtil.buildTextFromRegex(
            expr, 
            /pub Modify(\d{4})(\d{2})(\d{2})/,
            "$2/$3/$1 -\\$3 cache money");

        assert.strictEqual(newString, "11/11/2021 -$3 cache money");
    });
});