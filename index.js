var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(http);
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const DBCorns = require('./db.js');
const { time } = require('console');
const dbcorn = new DBCorns('test', 'log');
//app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.get('/' , function(req, res){
  dbcorn.readAll(res);
  //res.render('index', {title:'機材管理表'})
  //res.sendFile(__dirname + '/views/index.html');
});

io.on('connection',function(socket){
    socket.on('input', function(input_data){
        console.log(`貸出内容 ${input_data}`);
        var timeout = input_data[0];
        var machine = input_data[1];
        var used = input_data[2];
        var name = input_data[3];
        dbcorn.write(timeout, machine, used, name);
        io.emit('table_row', input_data);
    });
    socket.on('return', function(input_id, table_no){
        console.log(`返却報告${input_id}`);
        dbcorn.save(input_id, true);
        dbcorn.delete(input_id);
        io.emit('table_row_delete', table_no);
    });
});

http.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});