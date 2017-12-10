  'use strict';
  module.exports = function(app) {
  var testList = require('../controllers/TestController');

  // todoList Routes

  app.route('/template/Count')
    .get(testList.template_count);

  app.route('/template/Count/:imagekey')
    .get(testList.template_count);

  app.route('/template')
    .get(testList.list_all_tasks)
    .post(testList.register)
    .delete(testList.delete);

  app.route('/template/:imagekey')
    .get(testList.read_one);

  //app.route('/n2nSearch')
    //.post(testList.read_many);

  };