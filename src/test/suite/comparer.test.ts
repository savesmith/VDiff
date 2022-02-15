import * as assert from 'assert';
import { Signature } from "../../comparer/signature";
import { Method } from "../../comparer/method";
import { Code } from "../../comparer/code";
import { MethodPattern } from "../../comparer/method-pattern";

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
            const methodPatterns = new Array<MethodPattern>();
            methodPatterns.push(new MethodPattern(
                "",
                data.methodSignature,
                "",
                "",
                data.methodDescription
            ));
<<<<<<< HEAD
            const signature = Signature.createFrom(data.rawSignature);
=======
            const signature = Signature.createFrom(data.rawSignature, methodPatterns);
>>>>>>> 96b463ca4bd1a2c2763bac7152b4fdaff8e08b5c
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