# NICE Hosted pages

> Static website starter kit powered by [React.js](http://facebook.github.io/react/) and [Webpack](http://webpack.github.io/)


### Features

NEED TO USE NODE 6.2.2

&nbsp; &nbsp; ✓ Modern JavaScript syntax ([ES2015](http://babeljs.io/docs/learn-es2015/)+) via [Babel](http://babeljs.io/)<br>
&nbsp; &nbsp; ✓ Modern CSS/SCSS syntax (CSS3+) via [PostCSS](https://github.com/postcss/postcss)<br>
&nbsp; &nbsp; ✓ Routing and navigation via [React Router](https://github.com/reactjs/react-router)<br>
&nbsp; &nbsp; ✓ Modular styles via [CSS Modules](https://github.com/css-modules/css-modules)<br>
&nbsp; &nbsp; ✓ [Code-splitting](https://github.com/webpack/docs/wiki/code-splitting) and async chunk loading<br>
&nbsp; &nbsp; ✓ Hot Module Replacement ([HMR](https://webpack.github.io/docs/hot-module-replacement.html)) /w [React Hot Loader](http://gaearon.github.io/react-hot-loader/)<br>
&nbsp; &nbsp; ✓ Bundling and optimization with [Webpack](https://webpack.github.io/)<br>
&nbsp; &nbsp; ✓ Cross-device testing with [Browsersync](https://browsersync.io/)<br>
&nbsp; &nbsp; ✓ IE8 Support (Need to build after)
### Directory Layout

```shell
.
├── /build/                     # The folder for compiled output
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/
    ├── /components/            # Shared/generic UI components
    │   ├── /Layout/            # Layout component
    │   ├── /Button/            # Button component
    │   └── /...                # etc.
    ├── /containers/            # containers
    ├── /routes/                # View/screen UI components + routing information
    │   ├── /About/             # About page
    │   ├── /NotFound/          # Error page
    │   ├── /Home/              # Home page
    │   └── /...                # etc.
    ├── /static/                # Static files such as favicon.ico etc.
├── /test/                      # Unit and integration tests
├── /tools/                     # Build automation scripts and utilities
│── LICENSE.txt                 # Licensing information
│── package.json                # The list of project dependencies and NPM scripts
└── README.md                   # Project overview / getting started guide
```


### Getting Started

Just clone the repo, install Node.js modules and run `npm start`:

```shell
$ git clone <repo> MyApp
$ cd MyApp
$ npm install           # Install project dependencies listed in package.json
$ npm start             # Build and launch the app, same as "node tools/start.js"
```

**NODE**: Make sure that you have [Node.js](https://nodejs.org/) v6 installed on your local machine.

### IE8 Support Version

&nbsp; &nbsp; react <= 0.14.9<br>
&nbsp; &nbsp; react-dom <= 0.14.9<br>
&nbsp; &nbsp; react-router <= 2.3.0<br>
&nbsp; &nbsp; webpack = 1.15.0

### How to Test

The unit tests are powered by [chai](http://chaijs.com/) and [mocha](http://mochajs.org/).

```shell
$ npm test
```

### Histories

React Router history [guides](https://github.com/ReactTraining/react-router/blob/v2.3.0/docs/guides/Histories.md).

production web applications should use browserHistory for the cleaner URLs.

### How to Build

```shell
$ npm run build         # Build production release 
```

### Related Projects

* [React Starter Kit](https://github.com/kriasoft/react-starter-kit) — Isomorphic web app boilerplate (Node.js, React, GraphQL, Webpack, CSS Modules)
* [Babel Starter Kit](https://github.com/kriasoft/babel-starter-kit) — JavaScript library boilerplate (ES2015, Babel, Rollup, Mocha, Chai, Sinon, Rewire)
* [React Router](https://github.com/reactjs/react-router) — Declarative routing for React
* [History](https://github.com/mjackson/history) — HTML5 History API wrapper library

### Learn More

* [Getting Started with React.js](http://facebook.github.io/react/)
* [Getting Started with GraphQL and Relay](https://quip.com/oLxzA1gTsJsE)
* [React.js Questions on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
* [React.js Discussion Board](https://discuss.reactjs.org/)
* [Learn ES6](https://babeljs.io/docs/learn-es6/), [ES6 Features](https://github.com/lukehoban/es6features#readme)


### License

This source code is licensed under the MIT license found in the
