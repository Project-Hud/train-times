module.exports = getTrainTimes

var request = require('request')
  , moment = require('moment')
  , _ = require('lodash')

function getTrainTimes(cb) {

  var apiUrl = 'http://ojp.nationalrail.co.uk/service/ldb/liveTrainsJson?departing=true&liveTrainsFrom=' + process.env.LOCATION_FROM + '&liveTrainsTo=' + process.env.LOCATION_TO

  request(apiUrl, function (err, res, body) {
    try {
      body = JSON.parse(body)
    } catch (e) {
      console.error('Error parsing JSON:', body)
      return cb(e)
    }

    cb(null, pickFields(body))
  })
}

function unescapeHtml(unsafe) {
    return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#039;/g, "'");
  }

function pickFields(body) {
  return {
      timeChecked: body.time
    , services: _.map(body.trains.slice(0,6), function (service) {
        var obj = {}
        /*jshint camelcase: false */
        obj.departureTime = service[1]
        obj.destination = service[2]
        obj.availability = unescapeHtml(service[3])
        return obj
      })
    }
}
