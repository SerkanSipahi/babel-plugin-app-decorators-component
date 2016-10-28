import { elements } from './elements';

/**
 * plugin
 * @astexplorer: https://astexplorer.net/#/DG3oIHIg5f/11
 * @param t
 * @returns {{visitor: {ClassDeclaration: (function(*))}}}
 */
function plugin({types: t}) {

    let getDecorator = (node, decoratorName) => {

        let decorators = node.decorators || [];

        for(let decorator of decorators){
            let { name } = decorator.expression.callee;
            if(decoratorName === name){
                return decorator;
            }
        }

        return null;
    };

    let getElementClassByName = (name, elements) => {

        let element = elements[name] || 'HTMLElement';
        return element;
    };

    let getArguments = (node) => {

        // set default
        let args = {
            extends: 'div',
        };
        let [ firstArgument ] = node.expression.arguments;

        if(!t.isObjectExpression(firstArgument)){
            return args;
        }

        let { properties } = firstArgument;
        for(let property of properties){
            args[property.key.name] = property.value.value
        }

        return args;
    };


    let addSuperClass = (node, element) => {

        let identifier = t.identifier(element);
        node.superClass = identifier;
    };

    let addStaticGetterProperty = (node, type, superClass) => {

        let x = t.classMethod(
            'get',
            t.identifier(type),
            [],
            t.blockStatement([
                t.returnStatement(t.stringLiteral(superClass))
            ]),
            false,
            true
        );

        node.body.body.push(x);
    };

    return {
        visitor: {
            ClassDeclaration(path) {

                let node = path.node;

                let component = getDecorator(node, 'component');
                if(!component){
                    return;
                }

                let superClass = getArguments(component).extends;

                let element = getElementClassByName(superClass, elements);
                addSuperClass(node, element);

                if(superClass === 'div'){
                    return;
                }

                addStaticGetterProperty(node, 'extends', superClass)
            },
        },
    };
}

export default plugin;
