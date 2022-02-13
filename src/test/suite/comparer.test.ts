import * as comparer from "../../comparer/comparer";
import * as assert from 'assert';
import { Signature } from "../../comparer/signature";
import { Method } from "../../comparer/method";
import { Code } from "../../comparer/code";

suite('Extension Test Suite', () => {
    [
        {
            type: "Perl",
            comment: "####\n# My Comment\n####\n",
            rawSignature: "sub Modify20220124\n",
            code: "{}",
            methodDescription: "(^(?:#.*\\n)+)",
            methodSignature: "sub ([A-Za-z_]*)(\\d*)\\s"
        },
        {
            type: "C#",
            comment: "/*\n* My Comment\n*/\n",
            rawSignature: "public void Modify20220531\n",
            code: "{}",
            methodDescription: "(\\/\\*(.|\\n)*\\*\\/\n)",
            methodSignature: "(?:public|private)\\s+[A-Za-z0-9_.]+\\s+([A-Za-z_]+)(\\d+)",
        },

    ].forEach((data) => {
        test(`should grab comments with {data.type} signature`, () => {
            comparer.patterns.methodDescriptionPattern = data.methodDescription;
            comparer.patterns.methodSignaturePattern = data.methodSignature;
            const signature = Signature.createFrom(data.rawSignature);
            if(!signature) {
                assert.fail();
            }
            const method = new Method(
                signature, 
                new Code());
            const result = method.trySetDescription(data.comment + data.rawSignature + data.code);
            assert.strictEqual(result, true);
            assert.strictEqual(method.description, data.comment);
        });
    });
});