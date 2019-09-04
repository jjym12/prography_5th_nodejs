var express = require('express');
var app = express();
var qs = require('querystring');
var template = require('./lib/template.js');

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
db.defaults({ topic: [] }).write();
// db.get('topic').push({
//   title:'Node.js',
//   description:'Node.js is...'
// }).write();


app.get('/', function (request, response) {
  var title = 'Welcome';
  var description = '↓↓할 일을 추가해주세요. 당신의 할 일을 관리해 줍니다.↓↓';
  var list = template.list(db.get('topic').value());
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<button onclick = "location.href='/create'" >create</button>`
  );
  response.send(html);
});

app.get('/page/:pageId', function (request, response) {
  var pageId_topic = db.get('topic').find({ title: request.params.pageId }).value();
  var list = template.list(db.get('topic').value());
  var html = template.HTML(request.params.pageId, list,
    `<h2>Title: ${pageId_topic.title}</h2>Content: ${pageId_topic.description}<p>Date: ${pageId_topic.date}</p>`,
    `<button onclick = "location.href='/update/${request.params.pageId}'">update</button>
    <form action="/delete_process" method="post">
    <input type="hidden" name="id" value="${request.params.pageId}">
    <input type="submit" value="delete">
    </form>
    <button onclick = "location.href='/'">back</button>`
  );
  response.send(html);
});

app.get('/create', function (request, response) {
  var title = 'create';
  var list = template.list(db.get('topic').value());
  var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p><input type="text" name="date" placeholder="date"></p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
  response.send(html);
});

app.post('/create_process', function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.get('topic').push({ title: post.title, description:post.description , date:post.date}).write();
    response.redirect(`/page/${post.title}`);
  });
});

app.get('/update/:pageId', function (request, response) {
      var pageId_topic = db.get('topic').find({ title: request.params.pageId }).value();
      var list = template.list(db.get('topic').value());
      var html = template.HTML(request.params.pageId, list,
        `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${request.params.pageId}">
          <p><input type="text" name="title" placeholder="title" value="${pageId_topic.title}"></p>
          <p>
            <textarea name="description" placeholder="description">${pageId_topic.description}</textarea>
          </p>
          <p><input type="text" name="date" placeholder="date" value="${pageId_topic.date}"></p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, ``);
      response.send(html);
});

app.post('/update_process', function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.get('topic').find({ title: post.id}).assign({title: post.title, description:post.description,date:post.date}).write();
    response.redirect(`/page/${post.title}`);
  });
});

app.post('/delete_process', function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    var id = post.id;
    db.get('topic').remove({title:id}).write();
      response.redirect(`/`);
  });
});

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});