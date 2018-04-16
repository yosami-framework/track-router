require('../spec_helper');
const t                   = require('track-spec');
const UnmatchedController = require('../../lib/resolvers/unmatched_controller');

t.describe('UnmatchedController', () => {
  let controller = null;
  t.beforeEach(() => {
    controller = new UnmatchedController({attrs: {}, state: {}});
  });

  t.describe('#oninit', () => {
    const subject = (() => controller.oninit());

    t.it('Raise error', () => {
      let error = null;
      try {
        subject();
      } catch (e) {
        error = e;
      }
      t.expect(error.code).equals(404);
      t.expect(error.message).equals('Not Found');
    });
  });
});
