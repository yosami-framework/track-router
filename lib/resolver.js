const TrackConfig         = require('track-config');
const UnmatchedController = require('./resolvers/unmatched_controller');

/**
 * Route resolver.
 */
class Resolver {
  /**
   * Initialize route resolver.
   * @param {object} route Route definition.
   */
  constructor(route) {
    this._route = route;
  }

  /**
   * Match route.
   * @param {object} params Params.
   * @param {string} url    URL.
   * @return {TrackController} Controller.
   */
  onmatch(params, url) {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value      = params[key];
        const constraint = this._route.constraints[key];

        if (constraint && !constraint.test(value)) {
          return UnmatchedController;
        }
      }
    }

    return TrackConfig.loader(`controllers/${this._route.to}_controller`);
  }
}
module.exports = Resolver;
