# For iOS web page

1. import this shortcut
`https://www.icloud.com/shortcuts/5380f85f8b8d472bbd1399befdb3258c`
2. open any zhihu page in iOS safari
3. choose `Request Desktop Website`
4. click `share` button, and choose `Better 知乎`
5. Enjoy!

## Code

```javascript
const style = document.createElement("style")
style.innerHTML = `
.QuestionHeader-content,
.QuestionHeader-footer-inner,
.Question-main,
.Question-mainColumn,
.QuestionHeader {
  width: 100vw;
  margin: 0;
  padding: 0;
  min-width: auto !important;
}
.QuestionHeader-main {
  width: 100vw;
}
header,
.Question-sideColumn.Question-sideColumn--sticky,
.AdblockBanner,
.Card.QuestionHeaderTopicMeta,
.Pc-word {
  display: none;
}
.ContentItem-action {
  margin-left: 2px;
}
.Modal-wrapper {
  display: none !important;
}
html {
  overflow: auto !important;
}
body {
  position: initial !important;
}
.QuestionHeader-title {
  width: 90vw;
}
.ContentItem-actions {
  max-width: 100vw !important;
  overflow: auto;
}
`
document.body.appendChild(style)
```