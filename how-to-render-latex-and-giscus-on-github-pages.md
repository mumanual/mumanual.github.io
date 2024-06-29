## How to render Latex and Giscus on Github Pages?  

> Github supports $L^AT_EX$ by defaut now, while Github Pages doesn't yet.  

Fortunately, we can set a JS script to render both `latex` and `giscus` content, simply by adding the following html element in the bottom of markdown file(`.md`), then you can use the `$` to mark math equations. 

```html  
<script async src="/js/main.js"></script>
```  

Here I paste the content of `main.js`:  
```js
// add giscus support
var giscusStyle = document.createElement("style");
giscusStyle.textContent = `
.giscus {
    max-width: 1012px;
    margin-right: auto;  
    margin-left: auto;
}
`
document.head.appendChild(giscusStyle);

var giscusScript = document.createElement("script");
giscusScript.src = "https://giscus.app/client.js";
giscusScript.async = true;
giscusScript.setAttribute("data-repo", "mumanual/mumanual.github.io")
// ... add more properties
giscusScript.setAttribute("crossorigin", "anonymous")
document.body.appendChild(giscusScript);

// Below(↓↓↓) 
// I just put all the katex related files in `/js/katex/`  
// you can also use CDN to accelerate

// add katex styles
var katexCSS = document.createElement("link");
katexCSS.rel = "stylesheet";
katexCSS.href = "/js/katex/katex.min.css";
document.head.appendChild(katexCSS);

// add katex-auto-render
var katexScript = document.createElement("script");
katexScript.src = "/js/katex/katex.min.js";
katexScript.defer = true;
katexScript.type = "text/javascript";
katexScript.onload = function () {
    // We have to call the render function in the callback, 
    // otherwise we may get an error when loading the page 
    // for the first time 
    var autoRenderScript = document.createElement("script");
    autoRenderScript.src = "/js/katex/contrib/auto-render.min.js";
    autoRenderScript.type = "text/javascript";
    autoRenderScript.onload = function () {
        renderMathInElement(document.body, {
            // display:true display as a block
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                // I won't use other delimiters
            ],
            throwOnError: false
        });
    }

    document.body.appendChild(autoRenderScript)
}
document.body.appendChild(katexScript);
```

That's all the tricks. Have fun!  

-----  
12Tall 2024-06-30  

<script async src="/js/main.js"></script>