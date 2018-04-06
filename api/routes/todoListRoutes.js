'use strict';
module.exports = function(app) {
  var routesController = require('../controllers/routesController');

  // Routes are defined here
  app.route('/companies')
    .get(routesController.get_all_stocks);


  app.route('/api/companies/:symbol')
    .get(routesController.get_by_symbol);
}
