require('./spec_helper');
const t                   = require('track-spec');
const Resolver            = require('../lib/resolver');
const UnmatchedController = require('../lib/resolvers/unmatched_controller');
const MatchedController   = require('./fixtures/controllers/foos/show_controller');


t.describe('Resolver', () => {
  let resolver = null;

  t.beforeEach(() => {
    resolver = new Resolver({
      to:          'foos/show',
      path:        'foos/:foo_id/:id',
      constraints: {foo_id: /^\d+$/, id: /^\d+$/},
    });
  });

  t.describe('.onmatch', () => {
    const subject = (() => resolver.onmatch(params));
    let params = null;

    t.beforeEach(() => {
      params = {
        id: 12345,
      };
    });

    t.it('Return Controller', () => {
      t.expect(subject()).equals(MatchedController);
    });

    t.context('When params unmatch constraints', () => {
      t.beforeEach(() => {
        params = {
          id: 'abc',
        };
      });

      t.it('Return UnmatchedController', () => {
        t.expect(subject()).equals(UnmatchedController);
      });
    });
  });
});
