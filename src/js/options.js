export default (options) => {
    // default options
    const defaultOption = {
        root: document,     // DOM
        reentrant: false,   // Boolean
        startEvent: 'load', // String (Window Event name)
        once: false,        // Boolean
        duration: 500,      // CSS
        easing: 'ease-out', // CSS
        percent: 0.4,       // Float(0-1)
        offset: 120,        // Number (in px)
        distance: '20px',   // CSS
        rotate: '0',
        scale: 1,
        delay: 0,           // Number (in ms)
        debounce: 10,
        flip: 90,
        perspective: '2000px',
        attrName: 'data-scrollent'
    };

    if(!options) return defaultOption;

    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
            options[defaultKey] = defaultOption[defaultKey];
        }
    }

    return options
}