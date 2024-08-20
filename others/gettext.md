
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


-----   

12Tall 2024-08-20  

<script async src="/js/main.js"></script>
