# example-firenuxt
Init.

## Overview
Temp

## Getting started
The Nuxt.js team has created scaffolding tool [create-nuxt-app](https://github.com/nuxt/create-nuxt-app/).
```
// Create new Nuxt.js project
npx create-nuxt-app <project-name>
```

Move `.gitignore` and `.editorconfig` to the project root directory.

Open `nuxt.config.js` and add the following:
```js
module.exports = {
  buildDir: '../firebase/functions/nuxt',
  
  build: {
    publicPath: '/'
  }
}
```

Open `package.json` and change the `nuxt` package version.
```json
{
  "dependencies": {
    "nuxt": "^2.3.4"
  }
}
```

First go to (Firebase Console)[Go to https://console.firebase.google.com/] and create a new project. Next initialize Firebase in the project root directory.

```
mkdir firebase && cd firebase
firebase init

// Configuration

? Which Firebase CLI features do you want to setup for this folder?
[x] Functions
[x] Hosting

? Select a default Firebase project for this directory:
[create a new project]

? What language would you like to use to write Cloud Functions?
JavaScript

? Do you want to use ESLint to catch probable bugs and enforce style?
No

? Do you want to install dependencies with npm now?
Yes

? What do you want to use as your public directory?
public

? Configure as a single-page app (rewrite all urls to /index.html)?
Yes
```

Open `./firebase/firebase.json` and add the following:
```json
{
  "hosting": {
    "public": "functions/nuxt/dist/client/"
  },
  "rewrites": [{
    "source": "**",
    "function": "https-nuxtApp"
  }]
}
```

Move into the `./firebase/functions` directory, delete the `.gitignore`, and install some additional dependencies to get (webpack)[https://webpack.js.org/] and (babel)[https://babeljs.io/] setup.
```
npm i -S babel-runtime express nuxt
npm i -D babel-loader@^7.1.3 babel-core babel-plugin-transform-runtime babel-preset-env webpack webpack-cli webpack-node-externals
```

Create a `webpack.config.js` file:
```js
// ./firebase/functions/webpack.config.js

const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: __dirname,
    libraryTarget: 'this'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.js' ]
  },
  externals: [ nodeExternals() ]
}


module.exports = config
```

Lets create a `./firebase/functions/src` directory and make that `entry.js` for `webpack`.
```js
// ./firebase/functions/src/index.js

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import nuxtApp from './nuxtApp'

admin.initializeApp(functions.config().firebase)

export { nuxtApp }
```

Now lets create the Server-side Rendered function magic.
```js
// ./firebase/functions/src/nuxtApp.js


import * as functions from 'firebase-functions'
import express from 'express'
import { Nuxt } from 'nuxt'

const app = express()

const config = {
  dev: false,
  buildDir: 'nuxt',
  build: {
    publicPath: '/'
  }
}

const nuxt = new Nuxt(config)

function handleRequest(req, res) {
  nuxt.renderRoute('/').then(result => {
    res.send(result.html)
  }).catch(e => {
    res.send(e)
  })
}

app.get('*', handleRequest)

export const nuxtApp = functions.https.onRequest(app)
```

Create a `.babelrc` file to configure `babel`. Important to note the target `node` version; Firebase Functions only currently supports up to `node` version 8.
```json
// ./firebase/functions/.babelrc


{
  "presets": [
    [ "env", {
      "target": {
        "node": "8"
      }
    }]
  ],
  "plugins": [
    ["transform-runtime", {
      "polyfill": true,
      "regenerator": true
    }]
  ]
}
```

Lets make some changes to `package.json`.
```json
// ./firebase/functions/package.json


{
  "engines": {
    "node": "8"
  },
  "scripts": {
    "build": "webpack --mode production --hide-modules"
  }
}
```




