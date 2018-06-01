import { FlowRouter } from 'meteor/kadira:flow-router';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('layoutDefault', { content: 'App_home' });
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