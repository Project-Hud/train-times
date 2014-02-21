module.exports = getTrainTimes

var request = require('request')
  , moment = require('moment')
  , _ = require('lodash')

function getTrainTimes(cb) {
  var apiUrl = 'http://ojp.nationalrail.co.uk/service/ldb/liveTrainsJson?departing=true&liveTrainsFrom=' + process.env.LOCATIONFROM + '&liveTrainsTo= ' + process.env.LOCATIONTO

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

function pickFields(body) {
  return {
      timeChecked: body.time
    , services: _.map(body.trains.slice(0,3), function (service) {
        var obj = {}
        /*jshint camelcase: false */
        obj.departureTime = service[1]
        obj.destination = service[2]
        obj.availability = service[3]

        return obj
      })
    }
}
