/*global requirejs */
import makeFileFilter from 'ember-cli-plupload/system/make-file-filter';

var keys = Object.keys;

export function initialize(app) {
  if (arguments[1]) { // Ember < 2.1
    app = arguments[1];
  }

  var entries = requirejs.entries;
  var fileFilterPrefix = app.modulePrefix + '/file-filters';
  var fileFilters = {};
  keys(entries).forEach(function (key) {

    if (key.indexOf(fileFilterPrefix) === 0) {
      var filterName = key.split('/').slice(-1);
      var module = require(key, null, null, true);
      if (module) {
        fileFilters[filterName] = module.default;
        makeFileFilter(filterName, module.default);
        app.register('file-filter:' + filterName, module.default, { instantiate: false });
      }
    }
  });

  app.register('app:file-filters', fileFilters, { instantiate: false });
  app.inject('component:pl-uploader', 'fileFilters', 'app:file-filters');
}

export default {
  name: 'pl-uploader',
  initialize: initialize
};
