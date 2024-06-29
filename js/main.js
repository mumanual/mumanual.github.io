
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
giscusScript.setAttribute("data-repo-id", "R_kgDOMPj82g")
giscusScript.setAttribute("data-category", "Announcements")
giscusScript.setAttribute("data-category-id", "DIC_kwDOMPj82s4Cgd9X")
giscusScript.setAttribute("data-mapping", "pathname")
giscusScript.setAttribute("data-strict", "0")
giscusScript.setAttribute("data-category-id", "DIC_kwDOMPj82s4Cgd9X")
giscusScript.setAttribute("data-reactions-enabled", "1")
giscusScript.setAttribute("data-emit-metadata", "0")
giscusScript.setAttribute("data-input-position", "bottom")
giscusScript.setAttribute("data-theme", "preferred_color_scheme")
giscusScript.setAttribute("data-lang", "en")
giscusScript.setAttribute("crossorigin", "anonymous")

document.body.appendChild(giscusScript);

var katexCSS = document.createElement("link");
katexCSS.rel = "stylesheet";
katexCSS.href = "/js/katex/katex.min.css";
document.head.appendChild(katexCSS);


var katexScript = document.createElement("script");
katexScript.src = "/js/katex/katex.min.js";
katexScript.defer = true;
katexScript.type = "text/javascript";
katexScript.onload = function () {
    var autoRenderScript = document.createElement("script");
    autoRenderScript.src = "/js/katex/contrib/auto-render.min.js";
    autoRenderScript.type = "text/javascript";
    autoRenderScript.onload = function () {
        renderMathInElement(document.body, {
            // display:true 表示独占一行显示
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
            ],
            throwOnError: false
        });
    }

    document.body.appendChild(autoRenderScript)
}
document.body.appendChild(katexScript);





