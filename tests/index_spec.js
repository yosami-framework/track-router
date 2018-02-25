const t           = require('track-spec');
const TrackRouter = require('../lib/index');

t.describe('TrackRouter', () => {
  t.beforeEach(() => {
    TrackRouter.configure(() => {
      get('/', {to: 'Index', as: 'root'});

      namespace('hoges', () => {
        get('/', {to: 'HogesIndex', as: 'index'});
        get('/:id', {to: 'HogesShow', as: 'show'});

        namespace('fugas', () => {
          get('/', {to: 'HogesFugasIndex', as: 'index'});
        });
      });

      namespace('foos', () => {
        namespace(':id', () => {
          get('/', {to: 'FooShow', as: 'show'});
          get('/bar', {to: 'FooBar', as: 'bar'});
        });
      });
    });
  });

  t.describe('.routes', () => {
    const subject = (() => TrackRouter.routes);

    t.it('Return routes', () => {
      t.expect(subject()['root']).deepEquals({path: '/', to: 'Index'});
      t.expect(subject()['hoges_index']).deepEquals({path: '/hoges', to: 'HogesIndex'});
      t.expect(subject()['hoges_show']).deepEquals({path: '/hoges/:id', to: 'HogesShow'});
      t.expect(subject()['hoges_fugas_index']).deepEquals({path: '/hoges/fugas', to: 'HogesFugasIndex'});
      t.expect(subject()['foos_show']).deepEquals({path: '/foos/:id', to: 'FooShow'});
      t.expect(subject()['foos_bar']).deepEquals({path: '/foos/:id/bar', to: 'FooBar'});
    });
  });

  t.describe('.mithrilRoutes', () => {
    const subject = (() => TrackRouter.mithrilRoutes);

    t.it('Return routes', () => {
      const routes = subject();
      t.expect(routes['/']).equals('Index');
      t.expect(routes['/hoges']).equals('HogesIndex');
      t.expect(routes['/hoges/:id']).equals('HogesShow');
      t.expect(routes['/hoges/fugas']).equals('HogesFugasIndex');
      t.expect(routes['/foos/:id']).equals('FooShow');
      t.expect(routes['/foos/:id/bar']).equals('FooBar');
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
