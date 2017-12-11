/* 使用 Node 抓取指定页面所有链接，并输出非有效链接
 * @Date: 2016-10-11 18:11:08
 * @Mofify: 2017-02-22 16:30
 * @Prepare: （install node） + （npm i cheerio async colors）
 * @Example: node ./using-node_check-the-validity-of-links.js 'your_target_url'
 */

var
  http = require('http'),
  fs = require('fs'),
  cheerio = require('cheerio'),
  parse = require('url').parse,
  async = require('async')

require('colors')

var
  TARGET_PATH = process.argv[2] || 'http://jeffjade.com/2016/03/30/104-front-end-tutorial/',
  TIMEOUT_VALUE = 45000

// Utility function that downloads a URL and invokes callback with the data.
function download (url, callback) {
  http.get(url, function (res) {
    var data = ''

    res.on('data', function (chunk) {
      data += chunk
    })

    res.on('end', function () {
      callback(data)
    })
  }).on('error', function (err) {
    console.log('Opps, Download Error Occurred !'.red)
    console.log(err)
  })
}

function requestUrl (url, callback) {
  var info = parse(url),
    path = info.pathname + (info.search || ''),
    options = {
      host: info.hostname,
      port: info.port || 80,
      path: path,
      method: 'GET'
    },
    req = null,
    request_timeout = null

  request_timeout = setTimeout(function () {
    request_timeout = null
    req.abort()
    callback(new Error('Request timeout'), url)
  }, TIMEOUT_VALUE)

  req = http.request(options, function (res) {
    clearTimeout(request_timeout)
    var chunks = [],
      length = 0
    res.on('data', function (chunk) {
      length += chunk.length
      chunks.push(chunk)
    }).on('end', function () {
      var data = new Buffer(length)
      for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
        chunks[i].copy(data, pos)
        pos += chunks[i].length
      }
      res.body = data
      callback(null, 'normal-link')
    }).on('error', function (err) {
      callback(err, url)
    })
  }).on('error', function (err) {
    // node0.5.x及以上，调用req.abort()会触发一次“socket hang up” error；
    // 所以需要判断是否超时，如果是超时，则无需再回调异常结果
    if (request_timeout) {
      clearTimeout(request_timeout)
      callback(err, url)
    }
  })
  req.end()
}

function outPrint (resData) {
  var filepath = './err_url_list.json'
  var resJson = JSON.stringify(resData, null, 2)
  fs.writeFile(filepath, resJson, function (e) {
    if (e) throw e
  })
}

function callback (err, errUrlArr) {
  if (errUrlArr.length <= 0) {
    console.log('Nice, All links in the page are accessible. '.green)
    return
  }

  console.log('These are invalid links (Maybe for you to shield)：'.yellow)
  var invalidUrlList = errUrlArr.filter(item => {
    if (item !== "normal-link") {
      console.log(item.red)
      return item
    }
  })
  outPrint(invalidUrlList)
  process.exit()
}

function filterInvalidLinks (needFilterList) {
  async.map(needFilterList, function(item, _callback) {
    requestUrl(item, _callback)
  }, function(err, results) {
      callback(err, results)
  })
}

function mian (targetUrl) {
  console.log('>> Start crawling all links ...'.green)
  download(targetUrl, function (data) {
    if (data) {
      console.log('Well done! Grab all the links work has been completed!'.green)

      var $ = cheerio.load(data),
        saveGrabbingLinkArr = []

      $('body a').each(function (i, e) {
        var aTagsVal = $(e).attr('href')
        if (!!aTagsVal && (aTagsVal.indexOf('http://') === 0 || aTagsVal.indexOf('https://') === 0)) {
          console.log(i, aTagsVal)
          saveGrabbingLinkArr.push(aTagsVal)
        }
      })
      console.log('>> Start handle these links(Eg: Duplicate removal，Make the path complete) ...'.cyan)
      console.log('>> Start analyzing the effectiveness of all links ...'.green)
      filterInvalidLinks(saveGrabbingLinkArr)
    }
  })
}

mian(TARGET_PATH)
