// Library Code
// ============

// create HTML node from `item`, converting it if
// necessary
//
// string -> text node
function toNode(item) {
    if (item instanceof HTMLElement) {
        return item;
    } else if (typeof item == `string`) {
        return document.createTextNode(item);
    } else if (item === undefined) {
        throw new Error(`cannot convert undefined to node`);
    } else if (item === null) {
        throw new Error(`cannot convert null to node`);
    }
}

function uiElement(elType, attributes, ...content) {
    let element;
    if (typeof elType == `string`) {
        element = document.createElement(elType);
    } else {
        element = elType;
    }

    if (attributes) {
        Object.keys(attributes).forEach(name => {
            element.setAttribute(name, attributes[name]);
        });
    }

    content.forEach(x => element.appendChild(toNode(x)));

    return element;
}

export default uiElement;