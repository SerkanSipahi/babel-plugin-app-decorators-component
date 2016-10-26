import assert from 'assert';
import { transform } from 'babel-core';
import appDecoratorComponent from'./index';
import syntaxDecorator from 'babel-plugin-syntax-decorators';

function trim(str) {
    return str.replace(/^\s+|\s+$/, '');
}

describe('@component', () => {

    it('should add class extends HTMLElement when no options passed', () => {

        let actual =`
            @component()
            class Foo {
            }
        `;

        let expected = `
            @component()
            class Foo extends HTMLElement {
            }
        `;

        let generated = transform(actual, {
            plugins: [
                appDecoratorComponent,
                syntaxDecorator,
            ]
        });

        assert.equal(trim(generated.code), trim(expected));

    });

    it('should add "class extends HTML{type}" when options passed', () => {

        let actual =`
            @component({
               extends: 'img'
            })
            class Foo {
            }
        `;

        let expected =`
            @component({
               extends: 'img'
            })
            class Foo extends HTMLImageElement {
            }
        `;

        let generated = transform(actual, {
            plugins: [
                appDecoratorComponent,
                syntaxDecorator,
            ]
        });

        assert.equal(trim(generated.code), trim(expected));

    });

    it('should resolve and add "class extends HTML{type}" when options passed', () => {

        let actual =`
            class Foo {}
            class Bar extends Foo {}
            
            @component({
               extends: 'form'
            })
            class Baz extends Bar {
            }
        `;

        let expected = `
            class Foo extends HTMLFormElement {}
            class Bar extends Foo {}
            
            @component({
               extends: 'form'
            })
            class Baz extends Bar {
            }
        `;

        let generated = transform(actual, {
            plugins: [
                appDecoratorComponent,
                syntaxDecorator,
            ]
        });

        assert.equal(trim(generated.code), trim(expected));

    });

});
