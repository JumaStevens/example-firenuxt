import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { nuxtApp } from './nuxtApp'

admin.initializeApp(functions.config().firebase)

export { nuxtApp }
