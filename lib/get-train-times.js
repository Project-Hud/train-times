module.exports = getTrainTimes

var request = require('request')
  , moment = require('moment')
  , _ = require('lodash')

function getTrainTimes(cb) {
  var apiUrl = 'http://api.traintimes.im/locations.json?location=' + process.env.LOCATION + '&date=' + moment().format('YYYY-MM-DD') + '&startTime=' + moment().format('HHmm')

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

// Convert hhmm to hh:mm
function splitTime(time) {
  return time.substring(0, 2) + ':' + time.substring(2, 4)
}

function pickFields(body) {
  return {
      location: body.locations.location
    , services: body.services.map(function (service) {
        var obj = _.pick(service, 'origin', 'destination', 'departure_time', 'arrival_time')

        /*jshint camelcase: false */
        obj.departureTime = splitTime(obj.departure_time)
        obj.arrivalTime = splitTime(obj.arrival_time)

        return obj
      })
    }
}
