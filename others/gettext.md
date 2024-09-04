
`gettext` 是一个工具集，用于提取源码中的特定字符串，生成翻译文件的模板`portable object template`。翻译人员可以根据翻译模板`.pot` 再翻译生成不同目标语言的生成翻译文件`portable object`。最后，将`.po` 文件编译成机器对象文件`Machine Object(.mo)`。在程序运行时就可以根据系统环境或者人为设置软件的语言。  

## 代码结构  
```text
+---locale
|   \---zh_CN
|       \---LC_MESSAGES  -- LC_MESSAGES 用于文本，另有LC_TIME，LC_CURRENCY 等
|           +---app.mo
+---app.py
+---l10n.py
```  

### l10n.py  
`l10n.py` 作为本地化工具的统一入口，导出`_()` 方法，程序在运行时可以按需替换待翻译的内容：  
```python
# localization  
import os
print(f"Current LANG: {os.environ['LANG']}")

import gettext

# 指定翻译域和所在目录：程序会寻找`目录/语言/LC_MESSAGES/域名.mo`
gettext.bindtextdomain('app', 'locale') 

# 指定后续的`gettext` 使用这个翻译域，也就是`.mo` 文件
gettext.textdomain('app')

# 导出获取翻译后字符串的函数
_ = gettext.gettext
```

### app.py  
在其他代码文件中使用仅需导入`_()` 函数即可：  

```python  
from l10n import _
def say_hi(name:str):
    print(_("Hi, {}").format(name))
    # print(_(f"Hi, {name}")) # 这种格式化字符串不能翻译
    # 因为是先翻译再替换

def main():
    say_hi("Tom")

if __name__ == "__main__":
    print(_("app start..."))  
    main()
    print(_('app exit!'))
```


## xgettext 
此工具集最常用的工具是`xgettext`，用于从源码中提取`.pot` 模板文件。常见的用法如下：  
```bash  
# 以Python 项目为例，下同
xgettext -o app.pot ./app.py  # 从代码中提取模板  

# 批量提取(linux 用)
find . -iname "*.php" | xargs xgettext --from-code=UTF-8 --default-domain=project
```  

## poedit  
在生成`.pot` 模板文件之后，可以通过下载`poedit` 工具打开进行编辑。该工具默认会将文件保存为`.po` 翻译文件。在确认翻译完成后可以将文件导出为`.mo` 文件，按照规则放置到相应的目录，如：`./locale/zh_CN/LC_MESSAGES/app.mo`。  

如果软件有更新，可以重新生成`.pot` 文件，在`poedit` 中选择`翻译->从POT 文件更新`。即可选择更新的内容进行翻译，而不用重新来过。  

## art-template   
可以在`session` 中存储`lang` 信息，并且根据`lang` 去引用翻译的资源文件，以达到国际化的目的。用到的工具有[gettext.js](https://github.com/guillaumepotier/gettext.js) 和其中的`po2json` 工具。  
通过正则表达式获取`DOM` 元素中的`textContent`，并进行替换以达到自动翻译的结果。  
```html
<!DOCTYPE html>
{{ set lang = user_info?.lang ?? 'ja-JP' }}
<!-- <html lang="{{ lang ?? 'zh-CN'}}"> -->
<html lang="{{ lang}}">

<head>
    <meta charset="utf-8">
    <title>
        {{block 'title'}}
        _("网站标题")
        {{/block}}
    </title>
    <script src="/static/js/gettext.iife.min.js"></script>
    <script src="/static/i18n/{{lang}}.js"></script>  <!-- 语言资源文件 -->
    <script src="/static/js/i18n.js"></script>
</head>
```
下面时`i18n.js` 的内容：  
```js
const _i18n = window.i18n()
_i18n.loadJSON(po_json)

// _() 函数在js 中也可以直接使用
function _(msgid, ...args) {
    return _i18n.gettext(msgid, ...args)
}

function walk(node) {
    var child, next;
    if (node.tagName === 'SCRIPT') {
        // 不翻译普通js 标签
        const node_type = node.getAttribute('type') ?? 'text/javascript'
        if (node_type === 'text/javascript') {
            return
        }
    }

    switch (node.nodeType) {
        case 1: // Element
        case 9: // Document
        case 11: // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;
        case 3: // Text node                
            handleText(node);
            break;
    }
}

function handleText(textNode) {
    var text = textNode.nodeValue;
    // 匹配_("*") 函数字样
    var regex = /_\(\"((?:[^"]|\\")*)\"\)/g;
    // 替换内容
    var newText = text.replace(regex, function (match, p1) {
        return _(p1  // 处理转义字符
            .replace(/\\n/g, '\n')   // \n 
            .replace(/\\t/g, '\t')   // \t 
            .replace(/\\"/g, '"')    // \"
            .replace(/\\\\/g, '\\')  // \\ 
            .replace(/\\r/g, '\r')   // \r
            .replace(/\\f/g, '\f')  // \f 
        )
    });
    if (newText !== text) {
        textNode.nodeValue = newText;
    }
}

// 在所有页面元素加载完毕后会触发，但之后页面变化时不会重复触发
document.addEventListener('DOMContentLoaded', function () {
    walk(document.head)
    walk(document.body)
});        
```

语言资源文件的结构如下，如果使用`po2json` 的话需要稍微魔改一下：  
```js
const po_json = {"msgid":msgstr","":{"language":"ja_JP","plural-forms":"nplurals=2; plural=n>1;"}}
```

但是以上做法有一个太完美的地方，就是仅能修改`textContent` 中的内容，不能修改元素的`Attribute`。  

刚开始时打算使用`es6 module` 的方式引入，但是对脚本加载的顺序掌握的不牢固，所以还是改成了老式的风格。但是呢，后来发现，不管怎么引用，我只要定义一个`module` 放在最后就好了。

-----   

12Tall 2024-08-20  
12Tall 2024-09-04 更新art-template  

<script async src="/js/main.js"></script>
