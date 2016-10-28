import assert from 'assert';
import { transform } from 'babel-core';
import appDecoratorComponent from'../src/index';
import syntaxDecorator from 'babel-plugin-syntax-decorators';

function trim(str) {
    return str.replace(/^\s+|\s+/gm, '');
}

function transformCode(code){

    let generated = transform(code, {
        plugins: [
            appDecoratorComponent,
            syntaxDecorator,
        ]
    });

    return generated;
}

describe('@component', () => {

    it('should add class extends HTMLElement when no options passed', () => {

        let actual =`
            @component()
            class Foo {
            }`;

        let expected = `
            @component()
            class Foo extends HTMLDivElement {}`;

        let generated = transformCode(actual);

        assert.equal(trim(generated.code), trim(expected));

    });

    it('should add "class extends HTML{type}" when options passed', () => {

        let actual =`
            @component({
               extends: 'img'
            })
            class Foo {
            }`;

        let expected =`
            @component({
               extends: 'img'
            })
            class Foo extends HTMLImageElement {
                static get extends() {
                    return 'img';
            }}`;

        let generated = transformCode(actual);

        assert.equal(trim(generated.code), trim(expected));

    });

    it('should add "class extends HTML{type}" by mixed classes', () => {

        let actual =`
            class Foo {}

            @component({
               extends: 'progress'
            })
            class Bar {
            }

            class Baz {}`;

        let expected =`
            class Foo {}

            @component({
               extends: 'progress'
            })
            class Bar extends HTMLProgressElement {
                static get extends() {
                    return 'progress';
            }}

            class Baz {}`;

        let generated = transformCode(actual);

        assert.equal(trim(generated.code), trim(expected));

    });

});
