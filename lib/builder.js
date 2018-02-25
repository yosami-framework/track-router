const TrackDSL = require('track-dsl');

/**
 * Route Builder
 */
class Builder {
  /**
   * Initialize route biulder.
   * @param {array}  routes    Route definitions..
   * @param {string} name      Name.
   * @param {string} namespace Namespace.
   */
  constructor(routes, name = '', namespace = '') {
    this._routes = routes;
    this._name = name;
    this._namespace = namespace;
  }

  /**
   * Build routes from DSL function.
   * @param {function} func DSL function.
   */
  build(func) {
    const dsl = new TrackDSL(this, {
      'get':       {func: this._createRoute, binding: this},
      'namespace': {func: this._nestNamespace, binding: this},
    });
    dsl.evaluate(func);
  }

  /**
   * Create route.
   * @param {string} path    Path.
   * @param {object} options Options.
   */
  _createRoute(path, options = {to: null, as: null}) {
    const fullPath = `${this._namespace}/${path.replace(/^\//, '')}`.replace(/(.)\/$/, '$1');

    if (!options.to) {
      throw new Error(`${fullPath} set TrackController with 'to'. ex) 'to: require("hoge_controller.js")'`);
    }

    if (!options.as) {
      throw new Error(`${fullPath} set name with 'as'. ex) 'as: "hoge"'`);
    }

    const name = `${this._name}_${options.as}`.replace(/^_/, '').replace(/:.+_/, '');
    this._routes[name] = {
      path: fullPath,
      to:   options.to,
    };
  }

  /**
   * Nest namespace.
   * @param {string}   namespace Namespace.
   * @param {function} func      DSL function.
   */
  _nestNamespace(namespace, func) {
    namespace = namespace.replace(/^\/|\/$/g, '');

    (new Builder(
      this._routes,
      `${this._name}_${namespace.replace('/', '_')}`,
      `${this._namespace}/${namespace}`
    )).build(func);
  }
}
module.exports = Builder;
