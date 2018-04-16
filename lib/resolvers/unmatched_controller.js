const TrackController = require('track-controller');

/**
 * Route unmatched controller.
 */
class UnmatchedController extends TrackController {
  /**
   * Define class.
   */
  static definer() {
    name('TrackRouter::UnmatchedController');
  }

  /**
   * Initialize controller.
   */
  constructor(...args) {
    super(...args);
    this.raise(404, 'Not Found');
  }
}

module.exports = UnmatchedController;
