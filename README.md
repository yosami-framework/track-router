# TrackRouter
Router for track.

[![Build Status](https://travis-ci.org/yosami-framework/track-router.svg?branch=master)](https://travis-ci.org/yosami-framework/track-router)

## Installation

### npm

```shell
npm install track-router
```

## Usage

```javascript
const TrackRouter = require('track-router');

TrackRouter.configure(() => {
  get('/', {to: require('homes/index'), as: 'root'}); // `/`

  namespace('hoges', () => {
    get('/',   {to: 'hoges/index', as: 'index'}); // `/hoges`
    get(':id', {to: 'hoges/show',  as: 'show'});  // `/hoges/:id`

    namespace('fugas', () => {
      get(':id', {to: 'hoges/fugas/show',  as: 'show'}); // `/hoges/fugas/:id`
    });
  });

  namespace('foo', () => {
    namespace(':id', () => {
      get('/bar', {to: 'foo/bar/index', as: 'bar'}); // `/foo/:id/bar`
    });
  });
});

TrackRouter.getPath('root');                 // `/`
TrackRouter.getPath('hoges_show', {id: 777}) // `/hoges/777`
TrackRouter.getPath('foo_bar',    {id: 888}) // `/foo/888/bar`
```
