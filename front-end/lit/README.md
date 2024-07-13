
## Basic Structure  

We define `MyElement` by ES6 Module:  
```js
// source file: ./js/my-element.mjs  

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
// We can also download that script to local path
// import {LitElement, html} from './lit-core.min.js'; // the relative path format is needed

// 1. Declare An Element  
class MyElement extends LitElement {
    // 2. Add properties as static prop, we can't not use these 
    // properties until they have been inited in Constructor;
    // 
    // Although these properties are static, but each element has its own context
    static properties = {
        message: { type: String },
        // we can also set property as external attribute
        timer: { attribute: true, type: Number, reflect: true }
    }

    // 3. Add scoped styles
    static styles = css`
    div {
        color: red;
    }    
    `

    constructor() {
        super();
        this.message = "Hello World!";
        // this.timer = 0;
    }

    // 4. Add event listenner
    clicked(event) {
        this.timer += 1;
        this.message = `${event.target.nodeName} was clicked ${this.timer} times`;
    }


    // 5. Define the element which will be rendered at last
    render() {
        // we can declare [named] slot as well
        return html`<div @click="${this.clicked}">
        <slot>${this.message}</slot>
        </div>`;
    }
}

// 6. Define element in Webpage
customElements.define('my-element', MyElement);
```

Then, we can use the customed webcomponent `my-element` as follows:  
```html
<!--Your html content-->
<!--Auto import customed webcomponent-->
<script type="module" src="./js/my-element.mjs"></script>
<body>
    <!--Use webcomponent-->
    <my-element timer="0">Hello 12Tall!</my-element>
    <my-element timer="100"></my-element>
</body>
```

Finnally, You can see the result:  
<script type="module" src="./js/my-element.mjs"></script>
<my-element timer="0">Hello 12Tall!</my-element>
<my-element timer="100"></my-element>

### More Properties  

- `?attribute=${this.prop}`: will remove this `attr` if `this.prop` is not `true`;  

### Property Options  
- `attribute`: associate property with element attribute, default is `true`;  
- `converter`: set data type converter between element attribute and property;  
- `haschanged`: will be triggered when property changed;  
- `noAccessor`: default is `false`, not necessary;  
- `reflect`: default is `false`, property will refected to attribute;  
- `state`: set property as internal;  
- `type`: property data type;  

### Styles  
All `styles` defined in `static styles` are scoped!  


That's it, have fun :)  

<script async src="/js/main.js"></script>