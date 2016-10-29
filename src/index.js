import { elements } from './elements';

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

let getElementClassByName = function(name, elements) {

    let element = elements[name] || 'HTMLElement';
    return element;
};

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


let addSuperClass = function(element, t) {

    let identifier = t.identifier(element);
    this.superClass = identifier;
};

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
 * plugin
 * @astexplorer: https://astexplorer.net
 * @param t
 * @returns {{visitor: {ClassDeclaration: (function(*=))}}}
 */
let plugin = ({types: t}) => {

    return {
        visitor: {
            ClassDeclaration({ node } = path) {

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
