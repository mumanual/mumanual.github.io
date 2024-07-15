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
        
        // you can not get slot content in constructor!
        const slot = this.renderRoot?.querySelector('slot');
        console.log(slot.assignedNodes());
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