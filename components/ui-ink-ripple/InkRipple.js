let rippleParentClass = 'ui-ink-ripple';
let rippleClass = 'ui-ripple';
let rippleActiveClass = 'ui-active';
let registeredMouseFunction;
let referenceElement;

let unregisterMouseEvent = (el = referenceElement) => {
    el.removeEventListener('mousedown', registeredMouseFunction);
};

let registerMouseEvent = (element, holder) => {
    if (holder) {
        let ripple = holder.querySelector(':scope > .' + rippleParentClass + '> .' + rippleClass);

        if (ripple) {
            registeredMouseFunction = (event) => {
                let rect = holder.getBoundingClientRect();

                event.stopPropagation();

                ripple.classList.remove(rippleActiveClass);

                let top = event.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
                let left = event.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;

                ripple.style.top = top + 'px';
                ripple.style.left = left + 'px';

                ripple.classList.add(rippleActiveClass);
            };

            element.removeEventListener('mousedown', registeredMouseFunction);
            element.addEventListener('mousedown', registeredMouseFunction);
        }
    }
};

let createElement = (ripple, className, size) => {
    ripple = document.createElement('div');
    ripple.className = className;

    if (size) {
        ripple.style.width = size;
        ripple.style.height = size;
    }

    return ripple;
};

let checkAvailablePositions = (element) => {
    let availablePositions = ['relative', 'absolute', 'fixed'];

    return availablePositions.indexOf(getComputedStyle(element).position) > -1;
};

let getClosestParent = (element) => {
    let found = false;
    let parent = element;

    if (!element) {
        return false;
    }

    if (checkAvailablePositions(element)) {
        return element;
    }

    while (!found) {
        parent = parent.parentNode;

        if (!parent || parent.tagName.toLowerCase() === 'body') {
            break;
        }

        if (parent && checkAvailablePositions(parent)) {
            found = parent;
        }
    }

    return found;
};

let createRipple = (element, currentRipple) => {
    let holder = getClosestParent(element);

    if (holder) {
        let ripple = holder.querySelector(':scope > .' + rippleParentClass + '> .' + rippleClass);

        if (!ripple) {
            let elementSize = Math.round(Math.max(holder.offsetWidth, holder.offsetHeight)) + 'px';
            let rippleParent = currentRipple || createElement(ripple, rippleParentClass);
            let rippleElement = createElement(ripple, rippleClass, elementSize);

            rippleParent.appendChild(rippleElement);
            holder.appendChild(rippleParent);
        }

        if (holder !== element || !ripple) {
            referenceElement = element;
            registerMouseEvent(element, holder);
        }
    }
};

module.exports = {
    unregisterMouseEvent, registerMouseEvent, createRipple
}