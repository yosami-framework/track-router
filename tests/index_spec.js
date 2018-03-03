require('./spec_helper');
const t           = require('track-spec');
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
        namespace(':id', () => {
          get('/', {to: 'foos/show', as: 'show'});
          get('/bar', {to: 'foos/bar', as: 'bar'});
        });
      });
    });
  });

  t.describe('.routes', () => {
    const subject = (() => TrackRouter.routes);

    t.it('Return routes', () => {
      t.expect(subject()['root']).deepEquals({path: '/', to: 'root'});
      t.expect(subject()['hoges_index']).deepEquals({path: '/hoges', to: 'hoges/index'});
      t.expect(subject()['hoges_show']).deepEquals({path: '/hoges/:id', to: 'hoges/show'});
      t.expect(subject()['hoges_fugas_index']).deepEquals({path: '/hoges/fugas', to: 'fugas/index'});
      t.expect(subject()['foos_show']).deepEquals({path: '/foos/:id', to: 'foos/show'});
      t.expect(subject()['foos_bar']).deepEquals({path: '/foos/:id/bar', to: 'foos/bar'});
    });
  });

  t.describe('.mithrilRoutes', () => {
    const subject = (() => TrackRouter.mithrilRoutes);

    t.it('Return routes', () => {
      const routes = subject();
      t.expect(routes['/'].name).equals('root');
      t.expect(routes['/hoges'].name).equals('hoges/index');
      t.expect(routes['/hoges/:id'].name).equals('hoges/show');
      t.expect(routes['/hoges/fugas'].name).equals('fugas/index');
      t.expect(routes['/foos/:id'].name).equals('foos/show');
      t.expect(routes['/foos/:id/bar'].name).equals('foos/bar');
    });
  });

  t.describe('.getPath', () => {
    const subject = (() => {
      return TrackRouter.getPath('foos_bar', {id: 888});
    });

    t.it('Return routes', () => {
      t.expect(subject()).equals('/foos/888/bar');
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
