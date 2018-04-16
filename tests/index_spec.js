require('./spec_helper');
const t           = require('track-spec');
const TrackConfig = require('track-config');
const TrackRouter = require('../lib/index');

t.describe('TrackRouter', () => {
  t.beforeEach(() => {
    TrackRouter.configure(() => {
      get('/', {to: 'root', as: 'root'});

      namespace('hoges', () => {
        get('/', {to: 'hoges/index', as: 'index'});
        get('/:id', {to: 'hoges/show', as: 'show'});

        namespace('fugas', () => {
          get('/', {to: 'fugas/index', as: 'index'});
        });
      });

      namespace('foos', () => {
        namespace(':foo_id', {constraints: {foo_id: '/^\\d+$/'}}, () => {
          get('/', {to: 'foos/index', as: 'index'});
          get('/:id', {to: 'foos/show', as: 'show', constraints: {id: '/^\\d$/'}});
          get('/bar', {to: 'foos/bar', as: 'bar'});
        });
      });
    });
  });

  t.describe('.routes', () => {
    const subject = (() => TrackRouter.routes);

    t.it('Return routes', () => {
      t.expect(subject()['root']).deepEquals({path: '/', to: 'root', constraints: {}});
      t.expect(subject()['hoges_index']).deepEquals({path: '/hoges', to: 'hoges/index', constraints: {}});
      t.expect(subject()['hoges_show']).deepEquals({path: '/hoges/:id', to: 'hoges/show', constraints: {}});
      t.expect(subject()['hoges_fugas_index']).deepEquals({path: '/hoges/fugas', to: 'fugas/index', constraints: {}});
      t.expect(subject()['foos_index']).deepEquals({path: '/foos/:foo_id', to: 'foos/index', constraints: {foo_id: '/^\\d+$/'}});
      t.expect(subject()['foos_show']).deepEquals({path: '/foos/:foo_id/:id', to: 'foos/show', constraints: {foo_id: '/^\\d+$/', id: '/^\\d$/'}});
      t.expect(subject()['foos_bar']).deepEquals({path: '/foos/:foo_id/bar', to: 'foos/bar', constraints: {foo_id: '/^\\d+$/'}});
    });
  });

  t.describe('.mithrilRoutes', () => {
    const subject = (() => TrackRouter.mithrilRoutes);

    t.it('Return routes', () => {
      const routes = subject();
      t.expect(routes['/'].onmatch({}, '/').name).equals('root');
      t.expect(routes['/hoges'].onmatch({}, '/').name).equals('hoges/index');
      t.expect(routes['/hoges/:id'].onmatch({}, '/').name).equals('hoges/show');
      t.expect(routes['/hoges/fugas'].onmatch({}, '/').name).equals('fugas/index');
      t.expect(routes['/foos/:foo_id'].onmatch({}, '/').name).equals('foos/index');
      t.expect(routes['/foos/:foo_id/:id'].onmatch({}, '/').name).equals('foos/show');
      t.expect(routes['/foos/:foo_id/bar'].onmatch({}, '/').name).equals('foos/bar');
    });
  });

  t.describe('.getPath', () => {
    const subject = (() => {
      return TrackRouter.getPath('foos_bar', {foo_id: 888});
    });

    t.it('Return routes', () => {
      t.expect(subject()).equals('/foos/888/bar');
    });

    t.context('When set TrackConfig.relativeUrlRoot', () => {
      t.beforeEach(() => {
        TrackConfig.relativeUrlRoot = '/my-app';
      });

      t.afterEach(() => {
        TrackConfig.relativeUrlRoot = undefined;
      });

      t.it('Return routes', () => {
        t.expect(subject()).equals('/my-app/foos/888/bar');
      });
    });
  });

  t.describe('.replaceParams', () => {
    const subject = (() => {
      return TrackRouter.replaceParams('/hoge/:id/foo/:type', {id: 33, type: 'bar'});
    });

    t.it('Return routes', () => {
      t.expect(subject()).equals('/hoge/33/foo/bar');
    });
  });
});
