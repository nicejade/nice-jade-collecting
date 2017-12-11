
/*
 *@effect  Parse the specified Xlsx file And Output
 *@prepare install: node | fs + node-xlsx
 *@date    2016-10-11 11:00:51
 *@param   file path
 *@return  Output The Analytical Json About Your Xlsx-File
 *@example node your_path/parseReadXlsx.js  your_file(*.Xlsx)
 */

var fs = require('fs'),
    xlsx = require('node-xlsx')

startParse = function(req, res, next) {
    var path = process.argv[2],
        xlsxName = xlsx.parse(path)[0],
        datas = xlsx.parse(path)[0].data,
        resObj = {}
    console.log(xlsx.parse(path))

    // rIdx：行数；cIdx：列数
    for (var rIdx in datas) {
        columnData = datas[rIdx]
        resObj[rIdx] = {}
        for (var cIdx in columnData) {
            resObj[rIdx][cIdx] = columnData[cIdx]
        }
    }
    Output(resObj)
}

function Output(resData) {
    var filepath = './jade_xlsx_data' + (new Date).getTime() + '.json'
    var resJson = JSON.stringify(resData, null, 2)
    fs.writeFile(filepath, resJson, function(e) {
        if (e) throw e
    });
}

startParse()
