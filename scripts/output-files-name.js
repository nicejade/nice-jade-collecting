/*
 *@prepare install: node | fs 
 *@date    2016-09-22 11:54:51
 *@param   the floder-path you need scan and read (local) | n / N
 *@return  Output a .json or .txt file that is used to store the results
 *@example node E:\ScriptHome\ReadFloder [n/N]
 */
"use strict";

var fs = require('fs')

var rootPath = process.argv[2],
    is2Json = (process.argv[3] != 'n' || process.argv[3] != 'N') ? true : false,
    writeFile = (is2Json === true) ? 'res.json' : 'res.txt',
    writeContent = {}

console.log(writeFile)
console.log(process.argv[2], process.argv[3])

function getAllFiles(root) {
    var res = [],
        files = fs.readdirSync(root)
    files.forEach(function(file) {
        var pathname = root + '/' + file,
            stat = fs.lstatSync(pathname)

        if (!stat.isDirectory()) {
            res.push(pathname.replace(rootPath, '_rootpath_'))
        } else {
            res = res.concat(getAllFiles(pathname))
        }
    })
    return res
}

if (is2Json == true){
    var fileArr = getAllFiles(rootPath)
    for (var key = 0, len = fileArr.length; key < len; key++) {
        writeContent[key] = fileArr[key]
    }
    console.log(writeContent)
    var writeContentJson = JSON.stringify(writeContent , null, 2 )    
    fs.writeFile(rootPath + writeFile, writeContentJson, function(e){
        if(e) throw e
    })
} else {
    writeContent = getAllFiles(rootPath).join('\n')
    fs.readFile(rootPath + writeFile, function(err, data) {
        console.log(err)
        if (err && err.errno == 33) {
            fs.open(writeFile, "w", '0666', function(e, fd) {
                if (e) throw e
                fs.write(fd, writeContent, 0, 'utf8', function(e) {
                    if (e) throw e
                    fs.closeSync(fd)
                })
            })
        } else {
            fs.writeFile(rootPath + writeFile, writeContent, function(e) {
                if (e) throw e
            })
        }
    })
}
