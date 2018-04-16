const TrackDSL     = require('track-dsl');
const ObjectHelper = require('track-helpers/lib/object_helper');

/**
 * Route Builder
 */
class Builder {
  /**
   * Initialize route biulder.
   * @param {array}  routes      Route definitions..
   * @param {string} name        Name.
   * @param {string} namespace   Namespace.
   * @param {object} constraints Constraints.
   */
  constructor(routes, name = '', namespace = '', constraints = {}) {
    this._routes = routes;
    this._name = name;
    this._namespace = namespace;
    this._constraints = constraints;
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
    const fullPath = `${this._namespace}/${this._sanitizePath(path)}`.replace(/(.)\/$/, '$1');

    if (!options.to) {
      throw new Error(`${fullPath} set TrackController with 'to'. ex) 'to: require("hoge_controller.js")'`);
    }

    if (!options.as) {
      throw new Error(`${fullPath} set name with 'as'. ex) 'as: "hoge"'`);
    }

    const name = `${this._name}_${options.as}`.replace(/^_/, '').replace(/:.+_/, '');

    this._routes[name] = {
      path:        fullPath,
      to:          options.to,
      constraints: this._mergeConstraints(options.constraints),
    };
  }

  /**
   * Nest namespace.
   * @param {string}   path  Namespace path
   * @param {options}  funcOrOpts DSL function or Options.
   * @param {function} func       DSL function.
   */
  _nestNamespace(path, funcOrOpts, func) {
    const sanitizedPath = this._sanitizePath(path);
    const dslFunc       = (func || funcOrOpts);
    const constraints   = this._mergeConstraints(funcOrOpts.constraints);

    const nestName = `${this._name}_${sanitizedPath.replace(/\//g, '_')}`;
    const nestPath = `${this._namespace}/${sanitizedPath}`;

    (new Builder(this._routes, nestName, nestPath, constraints)).build(dslFunc);
  }

  /**
   * Merge with `this._constraints`
   * @param {object} constraints Constraints
   * @return {object} Merged constraints.
   */
  _mergeConstraints(constraints) {
    return ObjectHelper.deepMerge(constraints || {}, this._constraints);
  }

  /**
   * Sanitize path.
   * @note Remove `/` from head and tail.
   *
   * @param {string} path Path.
   * @return {string} Sanitized path.
   */
  _sanitizePath(path) {
    return path.replace(/^\/|\/$/g, '');
  }
}
module.exports = Builder;
