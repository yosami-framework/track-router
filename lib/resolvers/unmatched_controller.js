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
   * @note mithril.js API.
   * @override oninit
   */
  oninit(...args) {
    super.oninit(...args);
    this.raise(404, 'Not Found');
  }
}

module.exports = UnmatchedController;
