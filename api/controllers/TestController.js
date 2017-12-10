'use strict';

var bluebird = require("bluebird");
var redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var stringify = require('json-stringify');
var redisClient = redis.createClient();


exports.hellotest = function(req , res)
{
	res.send("hello worls");
}

exports.list_all_tasks = function(req, res) {
	var myResults = new Array();
	var formmatedResult = new Array();
	var responseComplete = false;
	scan('0', "*", myResults , function(resultArray)
		{
			//console.log("results returned:" + resultArray.length + " " + stringify(resultArray)); 
			var itemsProcessed = 0;
			if (resultArray.length === 0)
			{
				res.contentType('application/json');
				res.send(stringify(formmatedResult));	
			}
			else
			{
				resultArray.forEach(function(key,i){
	            	//var jsonTemplate = {};
	            	//console.log("query for key :" + key);
	            	redisClient.get(key,function(err , reply) {
	    				// reply is null when the key is missing 
	    				//console.log("value for key" + key + " returned value" + reply  + "  error:" + err);
	    				//jsonTemplate["key"] = key;
	    				//jsonTemplate["value"] = reply;
	    				itemsProcessed++;
	    				//formmatedResult.push(jsonTemplate);
	    				formmatedResult.push(JSON.parse(reply));

	    				if (itemsProcessed === resultArray.length)
	    				{
	    					//console.log("packaging the response");
							res.contentType('application/json');
							res.send(stringify(formmatedResult));
	    				}
	    			});
				});
			}
   			
		});
}


exports.register = function(req , res){

	//valid if the request is correct format 
	if (req.body.id && req.body.face_feature && req.body.face_attributes )
	{
		redisClient.set(req.body.id , stringify(req.body));
		res.send("key :" + req.body.id + " has been inserted");
	}
	else
	{
		res.send("inavlid post content found");
	}
}

exports.delete= function(req , res){

	redisClient.flushall();
	res.send("Redis DataBase Cleared");
}


exports.template_count = function(req,res){
	var searchKey = "*";
	var myResults = new Array();
	//console.log("count functionc called");
	if (req.params.imagekey)
		searchKey = req.params.imagekey;
	scan('0', searchKey, myResults , function(resultArray){
			//res.contentType('application/json');
			res.send("total template match:" + resultArray.length);
	});
}

exports.read_one = function(req,res){

	var myResults = new Array();
	var formmatedResult = new Array();
	var responseComplete = false;
	scan('0', req.params.imagekey, myResults , function(resultArray)
		{
			//console.log("results returned:" + resultArray.length + " " + stringify(resultArray)); 
			var itemsProcessed = 0;
			if (resultArray.length === 0)
			{
				res.contentType('application/json');
				res.send(stringify(formmatedResult));	
			}
			else
			{
				resultArray.forEach(function(key,i){
	            	//var jsonTemplate = {};
	            	//console.log("query for key :" + key);
	            	redisClient.get(key,function(err , reply) {
	    				// reply is null when the key is missing 
	    				//console.log("value for key" + key + " returned value" + reply  + "  error:" + err);
	    				//jsonTemplate["key"] = key;
	    				//jsonTemplate["value"] = reply;
	    				itemsProcessed++;
	    				//formmatedResult.push(jsonTemplate);
	    				formmatedResult.push(JSON.parse(reply));

	    				if (itemsProcessed === resultArray.length)
	    				{
	    					//console.log("packaging the response");
							res.contentType('application/json');
							res.send(stringify(formmatedResult));
	    				}
	    			});
				});
			}
   			
		});

}


function scan(cursor, pattern, returnSet , callback){

 
    return redisClient.scan(cursor, "MATCH", pattern, "COUNT", "100",function (err,reply)
        {
            cursor = reply[0];
            var keys = reply[1];
            keys.forEach(function(key,i){
            	returnSet.push(key);
            });

            if( cursor === '0' ){
            	//console.log("retruned the array set reults :" + returnSet.length);
                callback(returnSet);
            }else{
                return scan(cursor, pattern, returnSet,callback)
            }
    });
};