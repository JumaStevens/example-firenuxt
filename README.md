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

Move into the `./firebase/functions` directory, and lets setup (webpack)[https://webpack.js.org/].

delete the `.gitignore`, and create a `webpack.config.js` file.

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







