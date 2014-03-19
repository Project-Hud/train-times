
/**
 * Module dependencies.
 */

var Widget = new require('hud-widget')
  , widget = new Widget()
  , getTrainTimes = require('./lib/get-train-times')

widget.get('/', function (req, res) {
  getTrainTimes(function (error, trains) {
    if (error) {
      console.error(error)
      return res.send(500, { error: error })
    }

    res.render('index', { trains: trains })
  })
})
