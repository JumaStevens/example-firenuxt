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
  ...
  mode: 'universal',

  buildDir: '../firebase/functions/nuxt',
  
  build: {
    publicPath: '/'
  }
  ...
}
```

