const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const crypto = require('crypto');

module.exports = class DBCorns {
    response_data;
    constructor(dbs, collections) {
        this.dbs = dbs;
        this.collections = collections;
        this.connectOption = {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        };
        this.url = 'mongodb://127.0.0.1:27017/';
    }
    save(unique_id, return_ok){
        MongoClient.connect(this.url + this.dbs, this.connectOption, (error, db) => {
            if (error) throw error;
            const dbname = db.db(this.dbs);
            dbname.collection(this.collections).find({unique_id:unique_id}).toArray(function(error, response){
                if (error) throw error;
                const save_query = {
                    timeout : response[0].timeout,
                    machine : response[0].machine,
                    used : response[0].used,
                    name : response[0].name,
                    removed : return_ok,
                };
                dbname.collection('savelog').insertOne(save_query, function(error, response){
                    if (error) throw error;
                    console.log(`response if ${response.result.ok}`);
                    db.close();
                });
            });
        });
    };
    write(timeout, machine, used, name){
        const hash = crypto.createHash("sha256");
        var text = name + machine + used + timeout;
        var unique_id = hash.update(text).digest("hex")
        MongoClient.connect(this.url + this.dbs, this.connectOption, (error, db) => {
            if (error) throw error;
            //以下クエリを記述
            const dbname = db.db(this.dbs);
            const msgDoc = {
                timeout : timeout,
                machine : machine,
                used : used,
                name : name,
                removed : false,
                unique_id : unique_id,
            }
            dbname.collection(this.collections).insertOne(msgDoc, function(error, response){
                if (error) throw error;
                console.log(`response is ${response.result.ok}`);
                db.close();
            }); 
        });
    };
    delete(unique_id){
        MongoClient.connect(this.url + this.dbs, this.connectOption, (error, db) => {
            if (error) throw error;
            const dbname = db.db(this.dbs);
            var query = {unique_id : unique_id}
            dbname.collection(this.collections).deleteOne(query, function(error, object){
                if (error) throw error;
                console.log(object.result);
                db.close();
            });
        });
    };
    readAll(res){
        MongoClient.connect(this.url + this.dbs, this.connectOption, (error, db) => {
            if (error) throw error;
            //以下クエリを記述
            const dbname = db.db(this.dbs);
            dbname.collection(this.collections).find({}).toArray(function(error, response){
                if (error) throw error;
                var count = 1
                for (let item of response){
                    item['no'] = count;
                    count++;
                };
                res.render('index', {table_data : response});
                db.close();
            });
        });
    }; 

}