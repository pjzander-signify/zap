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

const fs = require('fs')
const dbApi = require('../src-electron/db/db-api.js')
const zclLoader = require('../src-electron/zcl/zcl-loader.js')
const Validation = require('../src-electron/validation/validation.js')
const querySession = require('../src-electron/db/query-session.js')
const queryConfig = require('../src-electron/db/query-config.js')
const queryZcl = require('../src-electron/db/query-zcl.js')
const env = require('../src-electron/util/env.js')

let db
let sid

beforeAll(() => {
  let file = env.sqliteTestFile('validation')
  return dbApi
    .initDatabaseAndLoadSchema(file, env.schemaFile(), env.zapVersion())
    .then((d) => {
      db = d
    })
}, 5000)

afterAll(() => {
  return dbApi.closeDatabase(db)
})

test('Load the static data.', () => {
  return zclLoader.loadZcl(db, env.builtinSilabsZclMetafile)
}, 5000)

test('isValidNumberString Functions', () => {
  // Integer
  expect(Validation.isValidNumberString('0x0000')).toBeTruthy()
  expect(Validation.isValidNumberString('0x0001')).toBeTruthy()
  expect(!Validation.isValidNumberString('0x00asdfajaklsf;01')).toBeTruthy()
  // Float
  expect(Validation.isValidFloat('5.6')).toBeTruthy()
  expect(Validation.isValidFloat('5')).toBeTruthy()
  expect(!Validation.isValidFloat('5.6....')).toBeTruthy()
  expect(Validation.isValidFloat('.0001')).toBeTruthy()
}, 5000)

test('extractValue Functions', () => {
  //Integer
  expect(Validation.extractIntegerValue('5') == 5).toBeTruthy()
  expect(Validation.extractIntegerValue('0x05') == 5).toBeTruthy()
  expect(Validation.extractIntegerValue('A') == 10).toBeTruthy()
  //float
  expect(Validation.extractFloatValue('0.53') == 0.53).toBeTruthy()
  expect(Validation.extractFloatValue('.53') == 0.53).toBeTruthy()
}, 5000)

test('Test int bounds', () => {
  //Integer
  expect(Validation.checkBoundsInteger(50, 25, 60)).toBeTruthy()
  expect(!Validation.checkBoundsInteger(50, 25, 20)).toBeTruthy()
  expect(!Validation.checkBoundsInteger(50, 51, 55)).toBeTruthy()
  expect(!Validation.checkBoundsInteger(30, 'avaa', 2)).toBeTruthy()
  expect(!Validation.checkBoundsInteger(30, 45, 50)).toBeTruthy()
  expect(Validation.checkBoundsInteger('asdfa', 40, 50)).toBeFalsy()

  //Float
  expect(Validation.checkBoundsFloat(35.0, 25, 50.0))
  expect(!Validation.checkBoundsFloat(351.0, 25, 50.0))
  expect(!Validation.checkBoundsFloat(351.0, 355, 5650.0))
}, 5000)

test('Validate types', () => {
  expect(Validation.isStringType('CHAR_STRING'))

  expect(Validation.isStringType('char_string'))
  expect(Validation.isStringType('OCTET_STRING'))
  expect(Validation.isStringType('LONG_CHAR_STRING'))
  expect(Validation.isStringType('LONG_OCTET_STRING'))
  expect(!Validation.isStringType('FLOAT_SEMI'))

  expect(Validation.isFloatType('FLOAT_SEMI'))
  expect(Validation.isFloatType('FLOAT_SINGLE'))
  expect(Validation.isFloatType('FLOAT_DOUBLE'))
  expect(!Validation.isFloatType('LONG_OCTET_STRING'))
}, 5000)

test(
  'Integer Test',
  () =>
    queryZcl
      .selectAttributesByClusterCodeAndManufacturerCode(db, 3, null)
      .then((attribute) => {
        attribute = attribute.filter((e) => {
          return e.code === 0
        })[0]

        //Test Constraints
        let minMax = Validation.getBoundsInteger(attribute)
        expect(minMax.min == 0).toBeTruthy()
        expect(minMax.max === 0xffff).toBeTruthy()
      }),
  2000
)

test('validate Attribute Test', () => {
  let fakeEndpointAttribute = {
    defaultValue: '30',
  }

  let fakeAttribute = {
    type: 'UINT16',
    min: '0x0010',
    max: '50',
  }

  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeTruthy()
  // Check for if attribute is out of bounds.
  fakeEndpointAttribute.defaultValue = '60'
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeFalsy()
  fakeEndpointAttribute.defaultValue = '5'
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeFalsy()

  //Check if attribute is actually a number
  fakeEndpointAttribute.defaultValue = 'xxxxxx'
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeFalsy()

  fakeAttribute = {
    type: 'FLOAT_SINGLE',
    min: '0.5',
    max: '2',
  }

  fakeEndpointAttribute = {
    defaultValue: '1.5',
  }
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeTruthy()
  //Check out of bounds.
  fakeEndpointAttribute = {
    defaultValue: '4.5',
  }
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeFalsy()
  fakeEndpointAttribute = {
    defaultValue: '.25',
  }
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeFalsy()

  //Check if attribute is actually a number
  fakeEndpointAttribute.defaultValue = 'xxxxxx'
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeFalsy()

  // Expect no issues with strings.
  fakeAttribute = {
    type: 'CHAR_STRING',
  }
  fakeEndpointAttribute = {
    defaultValue: '30adfadf',
  }
  expect(
    Validation.validateSpecificAttribute(fakeEndpointAttribute, fakeAttribute)
      .defaultValue.length == 0
  ).toBeTruthy()
}, 2000)

test('validate endpoint test', () => {
  //Validate normal operation
  let endpoint = {
    endpointId: '1',
    networkId: '0',
  }
  expect(
    Validation.validateSpecificEndpoint(endpoint).endpointId.length == 0
  ).toBeTruthy()
  expect(
    Validation.validateSpecificEndpoint(endpoint).networkId.length == 0
  ).toBeTruthy()

  //Validate not a number
  endpoint = {
    endpointId: 'blah',
    networkId: 'blah',
  }
  expect(
    Validation.validateSpecificEndpoint(endpoint).endpointId.length == 0
  ).toBeFalsy()
  expect(
    Validation.validateSpecificEndpoint(endpoint).networkId.length == 0
  ).toBeFalsy()

  //Validate 0 not being valid Endpoint ID
  endpoint = {
    endpointId: '0',
    networkId: 'blah',
  }
  expect(
    Validation.validateSpecificEndpoint(endpoint).endpointId.length == 0
  ).toBeFalsy()

  //Validate out of bounds on endpointId
  endpoint = {
    endpointId: '0xFFFFFFFF',
    networkId: 'blah',
  }
  expect(
    Validation.validateSpecificEndpoint(endpoint).endpointId.length == 0
  ).toBeFalsy()
}, 2000)

describe('Validate endpoint for duplicate endpointIds', () => {
  let endpointTypeIdOnOff
  let endpointTypeReference
  let eptId
  let pkgId
  beforeAll(async () => {
    let ctx = await zclLoader.loadZcl(db, env.builtinSilabsZclMetafile)
    pkgId = ctx.packageId
    let userSession = await querySession.ensureZapUserAndSession(
      db,
      'USER',
      'SESSION'
    )
    sid = userSession.sessionId
    let rows = await queryZcl.selectAllDeviceTypes(db, pkgId)
    let haOnOffDeviceTypeArray = rows.filter(
      (data) => data.label === 'HA-onoff'
    )
    haOnOffDeviceType = haOnOffDeviceTypeArray[0]
    let deviceTypeId = haOnOffDeviceType.id
    let rowId = await queryConfig.insertEndpointType(
      db,
      sid,
      'testEndpointType',
      deviceTypeId
    )
    endpointTypeIdOnOff = rowId
    let endpointType = await queryZcl.selectEndpointType(db, rowId)
    await queryConfig.insertEndpoint(
      db,
      sid,
      1,
      endpointType.endpointTypeId,
      1,
      23,
      43
    )
    eptId = await queryConfig.insertEndpoint(
      db,
      sid,
      1,
      endpointType.endpointTypeId,
      1,
      23,
      43
    )
  }, 10000)
  test(
    'Test endpoint for duplicates',
    () =>
      Validation.validateEndpoint(db, eptId)
        .then((data) => Validation.validateNoDuplicateEndpoints(db, eptId, sid))
        .then((hasNoDuplicates) => {
          expect(hasNoDuplicates).toBeFalsy()
        }),
    5000
  )
})
