'use strict';

module.exports = function(app) {
    var conf = require('../controllers/confControllers.js');

    // conf Routes
    app.route('/api/getSessions')
       .get(conf.list_all_conferences);

    app.route('/api/newSession')   
       .post(conf.create_a_conference);

    app.route('/api/getSession/:id')
       .get(conf.read_a_conference)
    
    //app.route('/updateSession/:id')
    //  .put(conf.update_a_conference)
    
    app.route('/api/deleteSession/:id')
       .delete(conf.delete_a_conference);
    
     app.route('/api/getSpeakerSessions/:speaker')
        .get(conf.list_all_conferences_by_speakername);
    
     app.route('/api/getSessionName/:sessionname')
        .get(conf.list_all_conferences_by_sessionname);

     app.route('/metrics')
        .get(conf.send_metrics);
}