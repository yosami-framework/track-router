# TrackRouter
Router for track.

## Installation

### npm

```shell
npm install track-router
```

## Usage

```javascript
const TrackRouter = require('track-router');

TrackRouter.configure(() => {
  get('/', {to: require('homes/index_controller'), as: 'root'}); // `/`

  namespace('hoges', () => {
    get('/',   {to: require('hoges/index_controller'), as: 'index'}); // `/hoges`
    get(':id', {to: require('hoges/show_controller'),  as: 'show'});  // `/hoges/:id`

    namespace('fugas', () => {
      get(':id', {to: require('hoges/fugas/show_controller'),  as: 'show'}); // `/hoges/fugas/:id`
    });
  });

  namespace('foo', () => {
    namespace(':id', () => {
      get('/bar', {to: require('foo/bar/index_controller'), as: 'bar'}); // `/foo/:id/bar`
    });
  });
});

TrackRouter.getPath('root');                 // `/`
TrackRouter.getPath('hoges_show', {id: 777}) // `/hoges/777`
TrackRouter.getPath('foo_bar',    {id: 888}) // `/foo/888/bar`
```
