/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 *
 * @jest-environment node
 */
const path = require('path')
const fs = require('fs')
const importJs = require('../src-electron/importexport/import.js')
const exportJs = require('../src-electron/importexport/export.js')
const dbEnum = require('../src-shared/db-enum.js')
const dbApi = require('../src-electron/db/db-api.js')
const env = require('../src-electron/util/env.js')
const zclLoader = require('../src-electron/zcl/zcl-loader.js')
const queryGeneric = require('../src-electron/db/query-generic.js')
const generationEngine = require('../src-electron/generator/generation-engine.js')
const querySession = require('../src-electron/db/query-session.js')
const testUtil = require('./test-util.js')
const queryConfig = require('../src-electron/db/query-config.js')

let db
let sleepyGenericZap = path.join(__dirname, 'resource/isc/sleepy-generic.zap')
let sleepyGenericIsc = path.join(__dirname, 'resource/isc/sleepy-generic.isc')
let testFile1 = path.join(__dirname, 'resource/save-file-1.zap')
let testFile2 = path.join(__dirname, 'resource/save-file-2.zap')
let testLightIsc = path.join(__dirname, 'resource/isc/test-light.isc')
let testDoorLockIsc = path.join(__dirname, 'resource/isc/ha-door-lock.isc')

// Due to future plans to rework how we handle global attributes,
// we introduce this flag to bypass those attributes when testing import/export.
let bypassGlobalAttributes = false

beforeAll(() => {
  env.setDevelopmentEnv()
  let file = env.sqliteTestFile('importexport')
  return dbApi
    .initDatabaseAndLoadSchema(file, env.schemaFile(), env.zapVersion())
    .then((d) => {
      db = d
      env.logInfo(`Test database initialized: ${file}.`)
    })
    .then(() => zclLoader.loadZcl(db, env.builtinSilabsZclMetafile))
    .catch((err) => env.logError(`Error: ${err}`))
}, 5000)

afterAll(() => {
  return dbApi.closeDatabase(db)
})

test('Basic gen template parsing and generation', async () => {
  let context = await generationEngine.loadTemplates(
    db,
    testUtil.testZigbeeGenerationTemplates
  )
  expect(context.crc).not.toBeNull()
  expect(context.templateData).not.toBeNull()
})

test(path.basename(testFile1) + ' - import', async () => {
  let importResult = await importJs.importDataFromFile(db, testFile1)
  let sid = importResult.sessionId

  let x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE')
  expect(x).toBe(1)
  x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE_CLUSTER')
  expect(x).toBe(11)
  x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE_COMMAND')
  expect(x).toBe(7)
  x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE_ATTRIBUTE')
  expect(x).toBe(21)

  let state = await exportJs.createStateFromDatabase(db, sid)
  let commandCount = 0
  let attributeCount = 0
  expect(state.featureLevel).toBe(env.zapVersion().featureLevel)
  expect(state.endpointTypes.length).toBe(1)
  expect(state.endpointTypes[0].clusters.length).toBe(11)
  state.endpointTypes[0].clusters.forEach((c) => {
    commandCount += c.commands.length
    attributeCount += c.attributes.length
  })
  expect(commandCount).toBe(7)
  // This flag exists for this test due to planned global attribute rework.
  expect(attributeCount).toBe(bypassGlobalAttributes ? 15 : 21)

  await querySession.deleteSession(db, sid)
})

test(path.basename(testFile2) + ' - import', async () => {
  let sid = await querySession.createBlankSession(db)
  await importJs.importDataFromFile(db, testFile2, sid)

  let x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE')
  expect(x).toBe(1)

  x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE_CLUSTER')
  expect(x).toBe(19)

  x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE_COMMAND')
  expect(x).toBe(24)

  x = await queryGeneric.selectCountFrom(db, 'ENDPOINT_TYPE_ATTRIBUTE')
  expect(x).toBe(28)

  let state = await exportJs.createStateFromDatabase(db, sid)
  let commandCount = 0
  let attributeCount = 0
  expect(state.endpointTypes.length).toBe(1)
  expect(state.endpointTypes[0].clusters.length).toBe(19)
  state.endpointTypes[0].clusters.forEach((c) => {
    commandCount += c.commands.length
    attributeCount += c.attributes.length
  })
  expect(commandCount).toBe(24)
  // This flag exists for this test due to planned global attribute rework.
  expect(attributeCount).toBe(bypassGlobalAttributes ? 16 : 28)
})

test(path.basename(sleepyGenericZap) + ' - import', async () => {
  let sid = await querySession.createBlankSession(db)
  await importJs.importDataFromFile(db, sleepyGenericZap, sid)
  let endpoints = await queryConfig.getAllEndpoints(db, sid)
  expect(endpoints.length).toBe(1)
  expect(endpoints[0].deviceIdentifier).toBe(1281)
})

test(
  path.basename(sleepyGenericIsc) + ' - import',
  async () => {
    let sid = await querySession.createBlankSession(db)
    await importJs.importDataFromFile(db, sleepyGenericIsc, sid)
    let endpoints = await queryConfig.getAllEndpoints(db, sid)
    expect(endpoints.length).toBe(1)
    expect(endpoints[0].deviceIdentifier).toBe(1281)
  },
  3000
)

test(path.basename(testLightIsc) + ' - read state', async () => {
  let state = await importJs.readDataFromFile(testLightIsc)
  expect(Object.keys(state.endpointTypes).length).toBe(4)
  expect(Object.keys(state.endpoint).length).toBe(3)
  expect(state.endpoint[2].endpoint).toBe(242)
  expect(state).not.toHaveProperty('parseState')
  expect(state.attributeType.length).toBe(6)
})

test(
  path.basename(testLightIsc) + ' - import',
  async () => {
    sid = await querySession.createBlankSession(db)
    await importJs.importDataFromFile(db, testLightIsc, sid)
    expect(sid).not.toBeUndefined()
    let endpointTypes = await queryConfig.getAllEndpointTypes(db, sid)
    expect(endpointTypes.length).toBe(4)
    expect(endpointTypes[0].name).toBe('Centralized')
    expect(endpointTypes[1].name).toBe('GreenPower')
    expect(endpointTypes[2].name).toBe('Primary')
    expect(endpointTypes[3].name).toBe('Touchlink')
    let endpoints = await queryConfig.getAllEndpoints(db, sid)
    expect(endpoints.length).toBe(3)
    let drp = await querySession.getSessionKeyValue(
      db,
      sid,
      dbEnum.sessionOption.defaultResponsePolicy
    )
    expect(drp).toBe('always')
  },
  5000
)

test(
  path.basename(testDoorLockIsc) + ' - import',
  async () => {
    sid = await querySession.createBlankSession(db)
    await importJs.importDataFromFile(db, testDoorLockIsc, sid)
    expect(sid).not.toBeUndefined()
    let endpointTypes = await queryConfig.getAllEndpointTypes(db, sid)
    expect(endpointTypes.length).toBe(1)
    let endpoints = await queryConfig.getAllEndpoints(db, sid)
    expect(endpoints.length).toBe(1)
    expect(endpoints[0].deviceIdentifier).toBe(10)
    let clusterState = await queryConfig.getAllEndpointTypeClusterState(
      db,
      endpointTypes[0].id
    )
    expect(clusterState.length).toBe(107)

    let drp = await querySession.getSessionKeyValue(
      db,
      sid,
      dbEnum.sessionOption.defaultResponsePolicy
    )
    expect(drp).toBe('conditional')
  },
  5000
)
