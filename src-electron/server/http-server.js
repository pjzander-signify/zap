// Copyright (c) 2020 Silicon Labs. All rights reserved.

/**
 * This module provides the HTTP server functionality.
 *
 * @module JS API: http server
 */

import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import path from 'path'
import { ensureZapSessionId } from '../db/query-session.js'
import { logError, logInfo } from '../util/env.js'
import { registerAdminApi } from '../rest/admin.js'
import { registerGenerationApi } from '../rest/generation.js'
import { registerStaticZclApi } from '../rest/static-zcl.js'
import { registerSessionApi } from '../rest/user-data.js'

var httpServer = null

export const httpCode = {
  ok: 200,
  badRequest: 400,
  notFound: 404,
}

/**
 * Promises to initialize the http server on a given port
 * using a given database.
 *
 * @export
 * @param {*} db Database object to use.
 * @param {*} port Port for the HTTP server.
 * @returns A promise that resolves with an express app.
 */
export function initHttpServer(db, port) {
  return new Promise((resolve, reject) => {
    const app = express()
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(
      session({
        secret: 'Zap@Watt@SiliconLabs',
        resave: true,
        saveUninitialized: true,
      })
    )

    // this is a generic logging stuff
    app.use((req, res, next) => {
      if (req.session.zapSessionId) {
        next()
      } else {
        let windowId = null
        let sessionId = null
        if ('winId' in req.query) windowId = req.query.winId
        if ('sessionId' in req.query) sessionId = req.query.sessionId

        ensureZapSessionId(db, req.session.id, windowId, sessionId)
          .then((sessionId) => {
            req.session.zapSessionId = sessionId
            next()
          })
          .catch((err) => {
            logError('Could not create session: ' + err.message)
          })
      }
    })

    // Simple get for an entity, id can be all or specific id
    registerStaticZclApi(db, app)
    registerSessionApi(db, app)
    registerGenerationApi(db, app)
    registerAdminApi(db, app)

    var staticDir = path.join(__dirname, __indexDirOffset)

    app.use(express.static(staticDir))

    httpServer = app.listen(port, () => {
      logInfo(`HTTP server created on port: ${port}`)
      resolve(app)
    })
  })
}
/**
 * Promises to shut down the http server.
 *
 * @export
 * @returns Promise that resolves when server is shut down.
 */
export function shutdownHttpServer() {
  return new Promise((resolve, reject) => {
    if (httpServer != null) {
      httpServer.close(() => {
        logInfo('HTTP server shut down.')
        httpServer = null
        resolve(null)
      })
    }
    resolve(null)
  })
}
