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
