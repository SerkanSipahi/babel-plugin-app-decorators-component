import { elements } from './elements';

/**
 * getDecorator
 * @param decoratorName
 * @returns {object|null}
 */
let getDecorator = function(decoratorName) {

    let decorators = this.decorators || [];

    for(let decorator of decorators){
        let { name } = decorator.expression.callee;
        if(decoratorName === name){
            return decorator;
        }
    }

    return null;
};

/**
 * getElementClassByName
 * @param name {string}
 * @param elements {object}
 * @returns {*|string}
 */
let getElementClassByName = function(name, elements) {

    let element = elements[name] || 'HTMLElement';
    return element;
};

/**
 * getArguments
 * @param t {object}
 * @returns {{extends: string}}
 */
let getArguments = function(t){

    // set default
    let args = {
        extends: 'div',
    };
    let [ firstArgument ] = this.expression.arguments;

    if(!t.isObjectExpression(firstArgument)){
        return args;
    }

    let { properties } = firstArgument;
    for(let property of properties){
        args[property.key.name] = property.value.value
    }

    return args;
};

/**
 * addSuperClass
 * @param element {string}
 * @param t {object}
 */
let addSuperClass = function(element, t) {

    let identifier = t.identifier(element);
    this.superClass = identifier;
};

/**
 * addStaticGetterProperty
 * @param type {string}
 * @param superClass {string}
 * @param t {object}
 */
let addStaticGetterProperty = function(type, superClass, t) {

    let classMethodNode = t.classMethod(
        'get',
        t.identifier(type),
        [],
        t.blockStatement([
            t.returnStatement(t.stringLiteral(superClass))
        ]),
        false,
        true
    );

    this.body.body.push(classMethodNode);
};

/**
 * defaultOptions
 * @type {{customElements: boolean}}
 */
let defaultOptions = {

    /**
     * possible values: false, v0, v1
     * customElements {boolean|string}
     */
    customElements: false,
};

/**
 * plugin
 * @astexplorer: https://astexplorer.net
 * @param t
 * @returns {{visitor: {ClassDeclaration: (function(*=))}}}
 */
let plugin = ({types: t}) => {

    return {
        visitor: {

            /**
             * ClassDeclaration
             * @param node {object}
             * @param opts {object}
             */
            ClassDeclaration({ node } = path, { opts } = state) {

                let options = Object.assign({}, defaultOptions, opts);

                let component = node::getDecorator('component');
                if(!component){
                    return;
                }

                let superClass = component::getArguments(t).extends;

                let element = getElementClassByName(superClass, elements);
                node::addSuperClass(element, t);

                if(/div/.test(superClass)){
                    return;
                }

                node::addStaticGetterProperty('extends', superClass, t);
            },
        },
    };
};

export default plugin;
