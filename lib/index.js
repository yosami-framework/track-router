const TrackConfig = require('track-config');
const Builder     = require('./builder');
const Resolver    = require('./resolver');

/**
 * Router for track.
 */
class TrackRouter {
  /**
   * Return routes.
   * @return {array} routes.
   */
  static get routes() {
    if (!this._routes) {
      this._routes = {};
    }
    return this._routes;
  }

  /**
   * Mithril routes.
   * @return {array} mithril format routes.
   */
  static get mithrilRoutes() {
    const routes = {};
    for (let key in this.routes) {
      if (this.routes.hasOwnProperty(key)) {
        const route = this.routes[key];
        routes[route.path] = new Resolver(route);
      }
    }
    return routes;
  }

  /**
   * Execute function with configure.
   * @param {function} func config function.
   */
  static configure(func) {
    (new Builder(this.routes)).build(func);
  }

  /**
   * Get path.
   * @param {string} name   Name of route.
   * @param {object} params Path parameters.
   * @return {string} path
   */
  static getPath(name, params = {}) {
    const route = this.routes[name];
    if (!route) {
      throw new Error(`${name} is not defined.`);
    }
    return (
      (TrackConfig.relativeUrlRoot || '') + this.replaceParams(route.path, params)
    );
  }

  /**
   * Replace params in path.
   * @param {string} path   Path.
   * @param {object} params Parameters.
   * @return {string} path
   */
  static replaceParams(path, params) {
    return path.replace(/:([^\/]+)/g, function(_, key) {
      return params[key];
    });
  }
}

module.exports = TrackRouter;
