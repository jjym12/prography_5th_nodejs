module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>prography_nodejs_ha - ${title}</title>
      <meta charset="utf-8">
      <style>
      .content {
        max-width: 500px;
        margin: auto;
      }
      .control {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
      }
      ul{list-style-type: square;}
      </style>
    </head>
    <body>
      <h1 align = 'center'><a href="/">To-Do-List</a></h1>
      <div class = 'content'>
      ${list}
      ${body}
      <p >-------------------------------------------------------------------</p>
      <div class= 'control'>
      ${control}
      </div>
      </div>
    </body>
    </html>
    `;
  }, list: function (filelist) {
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="/page/${filelist[i].title}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }
}
