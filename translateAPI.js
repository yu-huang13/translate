/**
 * Created by HY on 2017/2/30.
 */

//i.e. node translateAPI.js BaiDu sampleENG.json sampleCNSBaidu.json 100
//i.e. node translateAPI.js GoogleCN sampleENG.json sampleCNSGoogleCN.json 100
//i.e. node translateAPI.js iCIBA sampleENG.json sampleCNSICIBA.json 100

var transEngine = require('./translate.js');
var async = require("async");
var fs = require('fs');

var transMany = function(apiName, textList, threadNum, callback){
  var getFunc = function (apiName, text) {
    return function(innerDone){
      transEngine.translate(apiName, text, function(transTextList){
        innerDone(null, transTextList[0]);
      });
    };
  };
  var funcList = [];
  for (var i = 0; i < textList.length; ++i)
    funcList[i] = getFunc(apiName, textList[i]);

  async.parallelLimit(
    funcList,
    threadNum,    //并发数限制
    function(err, results){
      if (err)
        console.log('error:', err);
      callback(results);
    });
};

var transFileParallel = function(apiName, inputFile, outputFile, threadNum){
  var textList = JSON.parse(fs.readFileSync(inputFile));
  transMany(apiName, textList, threadNum, function(results){
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  });
};

var apiName = process.argv[2] || 'GoogleCN';
var inputFile = process.argv[3] || 'source.json';
var outputFile = process.argv[4] || 'result.json';
var threadNum = Number(process.argv[5] || '100');

transFileParallel(apiName, inputFile, outputFile, threadNum);











