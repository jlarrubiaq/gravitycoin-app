import { FlowRouter } from 'meteor/kadira:flow-router';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('layoutDefault', { content: 'home' });
  },
});

FlowRouter.route('/transferto/:userId', {
  name: 'transferTo',
  action() {
    BlazeLayout.render('layoutDefault', { content: 'transferTo' });
  },
});

FlowRouter.route('/transfer-result/:transferId', {
  name: 'transferResult',
  action() {
    BlazeLayout.render('layoutDefault', { content: 'transferResult' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('layoutDefault', { content: 'App_notFound' });
  },
};

// Set up all routes in the app.
FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('layoutDefault', { content: 'login' });
  },
});

// Set up all routes in the app.
FlowRouter.route('/register', {
  name: 'register',
  action() {
    BlazeLayout.render('layoutDefault', { content: 'register' });
  },
});