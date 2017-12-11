/*
 *@effect  Parse the specified xls file And Output
 *@prepare install: node | fs + node-xlrd
 *@date    2016-10-11 11:54:51
 *@param   file path
 *@return  Output The Analytical Json About Your Xls-File 
 *@example node your_path/parseReadXls.js  your_file(*.Xls)
 */

var fs = require('fs'),
    xl = require('node-xlrd')

startParse = function(req, res, next) {
    var path = process.argv[2]
    var datas = {}

    xl.open(path, function(err, bk) {
        if (err) { 
            console.log(err.name, err.message)
            return 
        }

        var shtCount = bk.sheet.count
        for (var sIdx = 0; sIdx < shtCount; sIdx++) {
            // console.log('sheet "%d" ', sIdx);
            // console.log('  check loaded : %s', bk.sheet.loaded(sIdx));
            var sht = bk.sheets[sIdx],
                rCount = sht.row.count,
                cCount = sht.column.count
            console.log('  name = %s; index = %d; rowCount = %d; columnCount = %d', sht.name, sIdx, rCount, cCount)

            // rIdx：行数； cIdx：列数
            for (var rIdx = 0; rIdx < rCount; rIdx++) {
                var data = {}
                for (var cIdx = 0; cIdx < cCount; cIdx++) {
                    try {
                        data[cIdx] = sht.cell(rIdx, cIdx)
                        console.log('  cell : row = %d, col = %d, value = "%s"', rIdx, cIdx, sht.cell(rIdx, cIdx))
                    } catch (e) {
                        console.log(e.message)
                    }
                }
                datas[rIdx] = data;
            }
        }

        Output(datas)
    })
}

function Output(resData) {
    var filepath = './jade_xls_data' + (new Date).getTime() + '.json'
    var resJson = JSON.stringify(resData, null, 2)
    fs.writeFile(filepath, resJson, function(e) {
        if (e) throw e
    });
}

startParse()
