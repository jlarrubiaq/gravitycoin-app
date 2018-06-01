import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.registerHelper('pathFor', ( pathname, params ) => {
  let parameters = {};

  // Escape of there is no path name given
  if (!pathname) return '';

  // If parameters exist and it is an object
  if (params && _.isObject(params)) {

    // If there is not a Spacebars object hash, use the given native object
    if (!_.has(params, 'hash') && _.size(params) > 0) {
      parameters = params;
    }

    // If there is a Spacebars object hash then use the given hash data
    if (_.has(params, 'hash') && _.size(params.hash) > 0) {
      parameters = params.hash;
    }
  }

  return FlowRouter.path(pathname, parameters);
});

Template.registerHelper("currentRoute", function(route) {
  if (FlowRouter.getRouteName() === route) return "active";
  return "";
});