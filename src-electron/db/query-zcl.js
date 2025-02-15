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
 */

/**
 * This module provides queries for ZCL static queries.
 *
 * @module DB API: zcl database access
 */
const dbApi = require('./db-api.js')
const dbMapping = require('./db-mapping.js')
const dbEnum = require('../../src-shared/db-enum.js')

/**
 * Retrieves all the enums in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of enums.
 */
async function selectAllEnums(db, packageId) {
  return dbApi
    .dbAll(
      db,
      'SELECT ENUM_ID, NAME, TYPE FROM ENUM  WHERE PACKAGE_REF = ? ORDER BY NAME',
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.enum))
}

async function selectAllEnumItemsById(db, id) {
  return dbApi
    .dbAll(
      db,
      'SELECT NAME, VALUE FROM ENUM_ITEM WHERE ENUM_REF = ? ORDER BY ORDINAL',
      [id]
    )
    .then((rows) => rows.map(dbMapping.map.enumItem))
}

async function selectAllEnumItems(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `SELECT ENUM_ITEM.NAME,
              ENUM_ITEM.VALUE,
              ENUM_ITEM.ENUM_REF
       FROM ENUM_ITEM, ENUM
       WHERE ENUM.PACKAGE_REF = ? AND ENUM.ENUM_ID = ENUM_ITEM.ENUM_REF
       ORDER BY ENUM_ITEM.ENUM_REF, ENUM_ITEM.ORDINAL`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.enumItem))
}

async function selectEnumById(db, id, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT ENUM_ID, NAME, TYPE FROM ENUM WHERE ENUM_ID = ? AND PACKAGE_REF = ? ORDER BY NAME',
      [id, packageId]
    )
    .then(dbMapping.map.enum)
}

async function selectEnumByName(db, name, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT ENUM_ID, NAME, TYPE FROM ENUM WHERE NAME = ? AND PACKAGE_REF = ? ORDER BY NAME',
      [name, packageId]
    )
    .then(dbMapping.map.enum)
}

/**
 * Retrieves all the bitmaps in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of bitmaps.
 */
async function selectAllBitmaps(db, packageId) {
  return dbApi
    .dbAll(
      db,
      'SELECT BITMAP_ID, NAME, TYPE FROM BITMAP WHERE PACKAGE_REF = ? ORDER BY NAME',
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.bitmap))
}

async function selectAllBitmapFieldsById(db, id) {
  return dbApi
    .dbAll(
      db,
      'SELECT NAME, MASK, TYPE FROM BITMAP_FIELD WHERE BITMAP_REF = ? ORDER BY ORDINAL',
      [id]
    )
    .then((rows) => rows.map(dbMapping.map.bitmapField))
}

async function selectAllBitmapFields(db, packageId) {
  return dbApi
    .dbAll(
      db,
      'SELECT NAME, MASK, TYPE, BITMAP_REF FROM BITMAP_FIELD  WHERE PACKAGE_REF = ? ORDER BY BITMAP_REF, ORDINAL',
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.bitmapField))
}

async function selectBitmapByName(db, packageId, name) {
  return dbApi
    .dbGet(
      db,
      'SELECT BITMAP_ID, NAME, TYPE FROM BITMAP WHERE NAME = ? AND PACKAGE_REF = ? ',
      [name, packageId]
    )
    .then(dbMapping.map.bitmap)
}

async function selectBitmapById(db, id, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT BITMAP_ID, NAME, TYPE FROM BITMAP WHERE BITMAP_ID = ? AND PACKAGE_REF = ? ORDER BY NAME',
      [id, packageId]
    )
    .then(dbMapping.map.bitmap)
}

/**
 * Retrieves all the domains in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of domains.
 */
async function selectAllDomains(db, packageId) {
  return dbApi.dbAll(
    db,
    'SELECT DOMAIN_ID, NAME FROM DOMAIN WHERE PACKAGE_REF = ? ORDER BY NAME',
    [packageId]
  )
}

async function selectDomainById(db, id, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT DOMAIN_ID, NAME FROM DOMAIN WHERE DOMAIN_ID = ?AND PACKAGE_REF = ? ORDER BY NAME',
      [id, packageId]
    )
    .then(dbMapping.map.domain)
}

/**
 * Retrieves all the structs in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of structs.
 */
async function selectAllStructs(db, packageId) {
  return dbApi
    .dbAll(
      db,
      'SELECT STRUCT.STRUCT_ID, STRUCT.NAME, COUNT(ITEM.NAME) AS ITEM_COUNT FROM STRUCT LEFT JOIN STRUCT_ITEM AS ITEM ON STRUCT.STRUCT_ID = ITEM.STRUCT_REF WHERE STRUCT.PACKAGE_REF = ? GROUP BY STRUCT.NAME ORDER BY STRUCT.NAME',
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.struct))
}

async function selectStructById(db, id, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT STRUCT_ID, NAME FROM STRUCT WHERE STRUCT_ID = ? AND PACKAGE_REF = ? ORDER BY NAME',
      [id, packageId]
    )
    .then(dbMapping.map.struct)
}

async function selectStructByName(db, name, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT STRUCT_ID, NAME FROM STRUCT WHERE NAME = ? AND PACKAGE_REF = ? ORDER BY NAME',
      [name, packageId]
    )
    .then(dbMapping.map.struct)
}

async function selectAllStructItemsById(db, id) {
  return dbApi
    .dbAll(
      db,
      'SELECT NAME, TYPE, STRUCT_REF, ARRAY_TYPE, MIN_LENGTH, MAX_LENGTH, IS_WRITABLE FROM STRUCT_ITEM WHERE STRUCT_REF = ? ORDER BY ORDINAL',
      [id]
    )
    .then((rows) => rows.map(dbMapping.map.structItem))
}

/**
 *
 *
 * @param  db
 * @param  name
 * @returns the details of the struct items given the name of the struct
 */
async function selectAllStructItemsByStructName(db, name) {
  return dbApi
    .dbAll(
      db,
      'SELECT STRUCT_ITEM.NAME, STRUCT_ITEM.TYPE, STRUCT_ITEM.STRUCT_REF, STRUCT_ITEM.ARRAY_TYPE FROM STRUCT_ITEM INNER JOIN STRUCT ON STRUCT.STRUCT_ID = STRUCT_ITEM.STRUCT_REF WHERE STRUCT.NAME = ? ORDER BY ORDINAL',
      [name]
    )
    .then((rows) => rows.map(dbMapping.map.structItem))
}

/**
 * Retrieves all the clusters in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of clusters.
 */
async function selectAllClusters(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  CLUSTER_ID,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  DESCRIPTION,
  DEFINE,
  DOMAIN_NAME,
  IS_SINGLETON
FROM CLUSTER
WHERE PACKAGE_REF = ?
ORDER BY CODE`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.cluster))
}

async function selectClusterByCode(db, packageId, code, mfgCode = null) {
  let query
  let args
  if (mfgCode == null) {
    query = `SELECT CLUSTER_ID, CODE, MANUFACTURER_CODE, NAME, DESCRIPTION, DEFINE, DOMAIN_NAME, IS_SINGLETON FROM CLUSTER WHERE PACKAGE_REF = ? AND CODE = ? AND MANUFACTURER_CODE IS NULL`
    args = [packageId, code]
  } else {
    query = `SELECT CLUSTER_ID, CODE, MANUFACTURER_CODE, NAME, DESCRIPTION, DEFINE, DOMAIN_NAME, IS_SINGLETON FROM CLUSTER WHERE PACKAGE_REF = ? AND CODE = ? AND MANUFACTURER_CODE = ?`
    args = [packageId, code, mfgCode]
  }
  return dbApi.dbGet(db, query, args).then(dbMapping.map.cluster)
}

/**
 * Returns a promise that resolves into a cluster.
 *
 * @param {*} db
 * @param {*} clusterId
 * @param {*} packageId
 * @returns promise that resolves into a cluster object
 */
async function selectClusterById(db, clusterId) {
  return dbApi
    .dbGet(
      db,
      `
SELECT
  CLUSTER_ID,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  DESCRIPTION,
  DEFINE,
  DOMAIN_NAME,
  IS_SINGLETON
FROM CLUSTER
WHERE CLUSTER_ID = ?`,
      [clusterId]
    )
    .then(dbMapping.map.cluster)
}

/**
 * Retrieves all the device types in the database.
 *
 * @export
 * @param {*} db
 * @returns Promise that resolves with the rows of device types.
 */
async function selectAllDeviceTypes(db, packageId) {
  return dbApi
    .dbAll(
      db,
      'SELECT DEVICE_TYPE_ID, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION FROM DEVICE_TYPE WHERE PACKAGE_REF = ? ORDER BY DOMAIN, CODE',
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.deviceType))
}

async function selectDeviceTypeById(db, id, packageId) {
  return dbApi
    .dbGet(
      db,
      'SELECT DEVICE_TYPE_ID, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION FROM DEVICE_TYPE WHERE DEVICE_TYPE_ID = ? AND PACKAGE_REF = ? ',
      [id, packageId]
    )
    .then(dbMapping.map.deviceType)
}

async function selectDeviceTypeByCodeAndName(db, packageId, code, name) {
  return dbApi
    .dbGet(
      db,
      'SELECT DEVICE_TYPE_ID, DOMAIN, CODE, PROFILE_ID, NAME, DESCRIPTION FROM DEVICE_TYPE WHERE CODE = ? AND NAME = ? AND PACKAGE_REF = ? ',
      [code, name, packageId]
    )
    .then(dbMapping.map.deviceType)
}

async function selectAttributesByClusterId(db, clusterId, packageId = null) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  ATTRIBUTE_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  TYPE,
  SIDE,
  DEFINE,
  MIN,
  MAX,
  IS_WRITABLE,
  DEFAULT_VALUE,
  IS_OPTIONAL,
  IS_REPORTABLE,
  IS_SCENE_REQUIRED,
  ARRAY_TYPE
FROM ATTRIBUTE
WHERE (CLUSTER_REF = ? OR CLUSTER_REF IS NULL)
  ${packageId != null ? 'AND PACKAGE_REF = ? ' : ''}
ORDER BY CODE`,
      packageId != null ? [clusterId, packageId] : [clusterId]
    )
    .then((rows) => rows.map(dbMapping.map.attribute))
}

async function selectAttributesByClusterIdAndSide(
  db,
  clusterId,
  packageId,
  side
) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  ATTRIBUTE_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  TYPE,
  SIDE,
  DEFINE,
  MIN,
  MAX,
  IS_WRITABLE,
  DEFAULT_VALUE,
  IS_OPTIONAL,
  IS_REPORTABLE,
  IS_SCENE_REQUIRED,
  ARRAY_TYPE
FROM ATTRIBUTE
WHERE
  SIDE = ?
  AND (CLUSTER_REF = ? OR CLUSTER_REF IS NULL)
  ${packageId != null ? 'AND PACKAGE_REF = ? ' : ''}
ORDER BY CODE`,
      packageId != null ? [side, clusterId, packageId] : [side, clusterId]
    )
    .then((rows) => rows.map(dbMapping.map.attribute))
}

async function selectAttributesByClusterCodeAndManufacturerCode(
  db,
  clusterCode,
  manufacturerCode
) {
  let manufacturerString
  if (manufacturerCode == null) {
    manufacturerString = ' AND CLUSTER.MANUFACTURER_CODE IS NULL'
  } else {
    manufacturerString =
      ' AND CLUSTER.MANUFACTURER_CODE IS NULL OR MANUFACTURER_CODE = ' +
      manufacturerCode
  }
  return dbApi
    .dbAll(
      db,
      `
SELECT
  ATTRIBUTE.ATTRIBUTE_ID,
  ATTRIBUTE.CLUSTER_REF,
  ATTRIBUTE.CODE,
  ATTRIBUTE.MANUFACTURER_CODE,
  ATTRIBUTE.NAME,
  ATTRIBUTE.TYPE,
  ATTRIBUTE.SIDE,
  ATTRIBUTE.DEFINE,
  ATTRIBUTE.MIN,
  ATTRIBUTE.MAX,
  ATTRIBUTE.IS_WRITABLE,
  ATTRIBUTE.DEFAULT_VALUE,
  ATTRIBUTE.IS_OPTIONAL,
  ATTRIBUTE.IS_REPORTABLE,
  ATTRIBUTE.IS_SCENE_REQUIRED,
  ATTRIBUTE.ARRAY_TYPE
FROM ATTRIBUTE, CLUSTER
WHERE CLUSTER.CODE = ?
  AND CLUSTER.CLUSTER_ID = ATTRIBUTE.CLUSTER_REF
  ${manufacturerString}`,
      [clusterCode]
    )
    .then((rows) => rows.map(dbMapping.map.attribute))
}

async function selectAttributeById(db, id) {
  return dbApi
    .dbGet(
      db,
      `
SELECT
  ATTRIBUTE_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  TYPE,
  SIDE,
  DEFINE,
  MIN,
  MAX,
  MIN_LENGTH,
  MAX_LENGTH,
  IS_WRITABLE,
  DEFAULT_VALUE,
  IS_OPTIONAL,
  IS_REPORTABLE,
  IS_SCENE_REQUIRED,
  ARRAY_TYPE
FROM ATTRIBUTE
WHERE ATTRIBUTE_ID = ?`,
      [id]
    )
    .then(dbMapping.map.attribute)
}
/**
 * This async function should be used when you want to get attributes, while also resolving against any global data that may be overridden by a particular cluster.
 * @param {*} db
 * @param {*} attributeId
 * @param {*} clusterRef
 */
async function selectAttributeByAttributeIdAndClusterRef(
  db,
  attributeId,
  clusterRef
) {
  return dbApi
    .dbGet(
      db,
      `
SELECT
  ATTRIBUTE.ATTRIBUTE_ID,
  ATTRIBUTE.CLUSTER_REF,
  ATTRIBUTE.CODE,
  ATTRIBUTE.MANUFACTURER_CODE,
  ATTRIBUTE.NAME,
  ATTRIBUTE.TYPE,
  ATTRIBUTE.SIDE,
  ATTRIBUTE.DEFINE,
  ATTRIBUTE.MIN,
  ATTRIBUTE.MAX,
  ATTRIBUTE.IS_WRITABLE,
  CASE WHEN ATTRIBUTE.CLUSTER_REF NOT NULL THEN ATTRIBUTE.DEFAULT_VALUE
       ELSE
          CASE
            WHEN EXISTS(SELECT DEFAULT_VALUE FROM GLOBAL_ATTRIBUTE_DEFAULT WHERE GLOBAL_ATTRIBUTE_DEFAULT.CLUSTER_REF = ? AND GLOBAL_ATTRIBUTE_DEFAULT.ATTRIBUTE_REF = ATTRIBUTE_ID)
              THEN (SELECT DEFAULT_VALUE FROM GLOBAL_ATTRIBUTE_DEFAULT WHERE GLOBAL_ATTRIBUTE_DEFAULT.CLUSTER_REF = ? AND GLOBAL_ATTRIBUTE_DEFAULT.ATTRIBUTE_REF = ATTRIBUTE_ID)
            ELSE ATTRIBUTE.DEFAULT_VALUE
          END
       END AS DEFAULT_VALUE,
  ATTRIBUTE.IS_OPTIONAL,
  ATTRIBUTE.IS_REPORTABLE,
  ATTRIBUTE.IS_SCENE_REQUIRED,
  ATTRIBUTE.ARRAY_TYPE
FROM ATTRIBUTE, GLOBAL_ATTRIBUTE_DEFAULT
WHERE ATTRIBUTE_ID = ?`,
      [clusterRef, clusterRef, attributeId]
    )
    .then(dbMapping.map.attribute)
}

async function selectAllAttributes(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  A.ATTRIBUTE_ID,
  A.CLUSTER_REF,
  A.CODE,
  A.MANUFACTURER_CODE,
  A.NAME,
  A.TYPE,
  A.SIDE,
  A.DEFINE,
  A.MIN,
  A.MAX,
  A.MIN_LENGTH,
  A.MAX_LENGTH,
  A.IS_WRITABLE,
  A.DEFAULT_VALUE,
  A.IS_OPTIONAL,
  A.IS_REPORTABLE,
  A.IS_SCENE_REQUIRED,
  A.ARRAY_TYPE,
  C.CODE AS CLUSTER_CODE
FROM
  ATTRIBUTE AS A
LEFT JOIN
  CLUSTER AS C
ON
  A.CLUSTER_REF = C.CLUSTER_ID
WHERE
  A.PACKAGE_REF = ?
ORDER BY
  C.CODE, A.CODE`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.attribute))
}

/**
 * Query for attributes by side.
 *
 * @param {*} db
 * @param {*} side
 * @param {*} packageId
 * @returns promise that resolves into attributes.
 */
async function selectAllAttributesBySide(db, side, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  ATTRIBUTE_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  TYPE,
  SIDE,
  DEFINE,
  MIN,
  MAX,
  IS_WRITABLE,
  DEFAULT_VALUE,
  IS_OPTIONAL,
  IS_REPORTABLE,
  IS_SCENE_REQUIRED,
  ARRAY_TYPE
FROM ATTRIBUTE
   WHERE SIDE = ?
   AND PACKAGE_REF = ?
ORDER BY CODE`,
      [side, packageId]
    )
    .then((rows) => rows.map(dbMapping.map.attribute))
}

async function selectCommandById(db, id) {
  return dbApi
    .dbGet(
      db,
      `SELECT COMMAND_ID, CLUSTER_REF, CODE, MANUFACTURER_CODE, NAME, DESCRIPTION, SOURCE, IS_OPTIONAL FROM COMMAND WHERE COMMAND_ID = ?`,
      [id]
    )
    .then(dbMapping.map.command)
}

/**
 * Retrieves commands for a given cluster Id.
 * This method DOES NOT retrieve global commands, since those have a cluster_ref = null
 *
 * @param {*} db
 * @param {*} clusterId
 * @returns promise of an array of command rows, which represent per-cluster commands, excluding global commands.
 */
async function selectCommandsByClusterId(db, clusterId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  COMMAND_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  DESCRIPTION,
  SOURCE,
  IS_OPTIONAL
FROM COMMAND WHERE CLUSTER_REF = ?
ORDER BY CODE`,
      [clusterId]
    )
    .then((rows) => rows.map(dbMapping.map.command))
}
/**
 * This method returns all commands, joined with their
 * respective arguments and clusters, so it's a long query.
 * If you are just looking for a quick query across all commands
 * use the selectAllCommands query.
 *
 * @param {*} db
 * @param {*} packageId
 * @returns promise that resolves into a list of all commands and arguments.
 */
async function selectCommandTree(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  CMD.COMMAND_ID,
  CMD.CLUSTER_REF,
  CMD.CODE,
  CMD.MANUFACTURER_CODE,
  CMD.NAME,
  CMD.DESCRIPTION,
  CMD.SOURCE,
  CMD.IS_OPTIONAL,
  CL.CODE AS CLUSTER_CODE,
  CL.NAME AS CLUSTER_NAME,
  CA.NAME AS ARG_NAME,
  CA.TYPE AS ARG_TYPE,
  CA.IS_ARRAY AS ARG_IS_ARRAY,
  CA.PRESENT_IF AS ARG_PRESENT_IF,
  CA.COUNT_ARG AS ARG_COUNT_ARG
FROM 
  COMMAND AS CMD
LEFT JOIN
  CLUSTER AS CL
ON
  CMD.CLUSTER_REF = CL.CLUSTER_ID
LEFT JOIN
  COMMAND_ARG AS CA
ON
  CMD.COMMAND_ID = CA.COMMAND_REF
WHERE CMD.PACKAGE_REF = ?
ORDER BY CL.CODE, CMD.CODE, CA.ORDINAL`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.command))
}

async function selectAllCommands(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  COMMAND_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  DESCRIPTION,
  SOURCE,
  IS_OPTIONAL
FROM COMMAND
  WHERE PACKAGE_REF = ?
ORDER BY CODE`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.command))
}

async function selectAllGlobalCommands(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  COMMAND_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  DESCRIPTION,
  SOURCE,
  IS_OPTIONAL
FROM COMMAND
WHERE CLUSTER_REF IS NULL AND PACKAGE_REF = ?
ORDER BY CODE`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.command))
}

async function selectAllClusterCommands(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  COMMAND_ID,
  CLUSTER_REF,
  CODE,
  MANUFACTURER_CODE,
  NAME,
  DESCRIPTION,
  SOURCE,
  IS_OPTIONAL
FROM COMMAND
WHERE CLUSTER_REF IS NOT NULL AND PACKAGE_REF = ?
ORDER BY CODE`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.command))
}

async function selectAllCommandArguments(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  COMMAND_ARG.COMMAND_REF,
  COMMAND_ARG.NAME,
  COMMAND_ARG.TYPE,
  COMMAND_ARG.IS_ARRAY,
  COMMAND_ARG.PRESENT_IF,
  COMMAND_ARG.INTRODUCED_IN_REF,
  COMMAND_ARG.REMOVED_IN_REF,
  COMMAND_ARG.COUNT_ARG
FROM COMMAND_ARG, COMMAND
WHERE
  COMMAND_ARG.COMMAND_REF = COMMAND.COMMAND_ID
  AND COMMAND.PACKAGE_REF = ?
ORDER BY COMMAND_REF, ORDINAL`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.commandArgument))
}

async function selectEndpointType(db, id) {
  return dbApi
    .dbGet(
      db,
      `SELECT ENDPOINT_TYPE_ID, SESSION_REF, NAME, DEVICE_TYPE_REF FROM ENDPOINT_TYPE WHERE ENDPOINT_TYPE_ID = ?`,
      [id]
    )
    .then(dbMapping.map.endpointType)
}

async function selectEndpointTypeClustersByEndpointTypeId(db, endpointTypeId) {
  return dbApi
    .dbAll(
      db,
      `SELECT ENDPOINT_TYPE_REF, CLUSTER_REF, SIDE, ENABLED FROM ENDPOINT_TYPE_CLUSTER WHERE ENDPOINT_TYPE_REF = ? ORDER BY CLUSTER_REF`,
      [endpointTypeId]
    )
    .then((rows) => rows.map(dbMapping.map.endpointTypeCluster))
}

async function selectEndpointTypeAttributesByEndpointId(db, endpointTypeId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF,
  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF,
  ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF,
  ENDPOINT_TYPE_ATTRIBUTE.INCLUDED,
  ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION,
  ENDPOINT_TYPE_ATTRIBUTE.SINGLETON,
  ENDPOINT_TYPE_ATTRIBUTE.BOUNDED,
  ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE,
  ENDPOINT_TYPE_ATTRIBUTE.INCLUDED_REPORTABLE,
  ENDPOINT_TYPE_ATTRIBUTE.MIN_INTERVAL,
  ENDPOINT_TYPE_ATTRIBUTE.MAX_INTERVAL,
  ENDPOINT_TYPE_ATTRIBUTE.REPORTABLE_CHANGE
FROM
  ENDPOINT_TYPE_ATTRIBUTE, ENDPOINT_TYPE_CLUSTER
WHERE
  ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF = ?
  AND ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
ORDER BY ATTRIBUTE_REF`,
      [endpointTypeId]
    )
    .then((rows) => {
      return rows.map(dbMapping.map.endpointTypeAttribute)
    })
}

async function selectEndpointTypeAttribute(
  db,
  endpointTypeId,
  attributeRef,
  clusterRef
) {
  return dbApi
    .dbGet(
      db,
      `
SELECT
  ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF,
  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF,
  ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF,
  ENDPOINT_TYPE_ATTRIBUTE.INCLUDED,
  ENDPOINT_TYPE_ATTRIBUTE.STORAGE_OPTION,
  ENDPOINT_TYPE_ATTRIBUTE.SINGLETON,
  ENDPOINT_TYPE_ATTRIBUTE.BOUNDED,
  ENDPOINT_TYPE_ATTRIBUTE.DEFAULT_VALUE,
  ENDPOINT_TYPE_ATTRIBUTE.INCLUDED_REPORTABLE,
  ENDPOINT_TYPE_ATTRIBUTE.MIN_INTERVAL,
  ENDPOINT_TYPE_ATTRIBUTE.MAX_INTERVAL,
  ENDPOINT_TYPE_ATTRIBUTE.REPORTABLE_CHANGE
FROM
  ENDPOINT_TYPE_ATTRIBUTE, ENDPOINT_TYPE_CLUSTER
WHERE
  ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF = ?
  AND ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF = ?
  AND ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
  AND ENDPOINT_TYPE_CLUSTER.CLUSTER_REF = ?`,
      [endpointTypeId, attributeRef, clusterRef]
    )
    .then(dbMapping.map.endpointTypeAttribute)
}

async function selectEndpointTypeCommandsByEndpointId(db, endpointTypeId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF,
  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF,
  ENDPOINT_TYPE_COMMAND.COMMAND_REF,
  ENDPOINT_TYPE_COMMAND.INCOMING,
  ENDPOINT_TYPE_COMMAND.OUTGOING
FROM
  ENDPOINT_TYPE_COMMAND, ENDPOINT_TYPE_CLUSTER
WHERE
  ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF = ?
  AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
ORDER BY COMMAND_REF`,
      [endpointTypeId]
    )
    .then((rows) => rows.map(dbMapping.map.endpointTypeCommand))
}

async function selectDeviceTypeClustersByDeviceTypeRef(db, deviceTypeRef) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  DEVICE_TYPE_CLUSTER_ID,
  DEVICE_TYPE_REF,
  CLUSTER_REF,
  CLUSTER_NAME,
  INCLUDE_CLIENT,
  INCLUDE_SERVER,
  LOCK_CLIENT,
  LOCK_SERVER
FROM
  DEVICE_TYPE_CLUSTER
WHERE
  DEVICE_TYPE_REF = ?
ORDER BY CLUSTER_REF`,
      [deviceTypeRef]
    )
    .then((rows) => rows.map(dbMapping.map.deviceTypeCluster))
}

async function selectDeviceTypeClusterByDeviceTypeClusterId(
  db,
  deviceTypeClusterId
) {
  return dbApi
    .dbGet(
      db,
      `
SELECT
  DEVICE_TYPE_CLUSTER_ID,
  DEVICE_TYPE_REF,
  CLUSTER_REF,
  CLUSTER_NAME,
  INCLUDE_CLIENT,
  INCLUDE_SERVER,
  LOCK_CLIENT,
  LOCK_SERVER
FROM
  DEVICE_TYPE_CLUSTER
WHERE
  DEVICE_TYPE_CLUSTER_ID = ?`,
      [deviceTypeClusterId]
    )
    .then(dbMapping.map.deviceTypeCluster)
}

async function selectDeviceTypeAttributesByDeviceTypeClusterRef(
  db,
  deviceTypeClusterRef
) {
  return dbApi.dbAll(
    db,
    `
SELECT
  DEVICE_TYPE_CLUSTER_REF,
  ATTRIBUTE_REF,
  ATTRIBUTE_NAME
FROM
  DEVICE_TYPE_ATTRIBUTE
WHERE
  DEVICE_TYPE_CLUSTER_REF = ?
ORDER BY ATTRIBUTE_REF`,
    [deviceTypeClusterRef]
  )
}

async function selectDeviceTypeCommandsByDeviceTypeClusterRef(
  db,
  deviceTypeClusterRef
) {
  return dbApi.dbAll(
    db,
    `
SELECT
  DEVICE_TYPE_CLUSTER_REF,
  COMMAND_REF,
  COMMAND_NAME
FROM
  DEVICE_TYPE_COMMAND
WHERE
  DEVICE_TYPE_CLUSTER_REF = ?
ORDER BY COMMAND_REF`,
    [deviceTypeClusterRef]
  )
}

async function selectDeviceTypeAttributesByDeviceTypeRef(db, deviceTypeRef) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  DEVICE_TYPE_CLUSTER.CLUSTER_REF,
  DEVICE_TYPE_ATTRIBUTE.DEVICE_TYPE_CLUSTER_REF,
  DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_REF,
  DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_NAME
FROM
  DEVICE_TYPE_ATTRIBUTE,
  DEVICE_TYPE_CLUSTER
WHERE
  DEVICE_TYPE_CLUSTER.DEVICE_TYPE_REF = ?
  AND DEVICE_TYPE_CLUSTER.DEVICE_TYPE_CLUSTER_ID = DEVICE_TYPE_ATTRIBUTE.DEVICE_TYPE_CLUSTER_REF`,
      [deviceTypeRef]
    )
    .then((rows) => rows.map(dbMapping.map.deviceTypeAttribute))
}

async function selectDeviceTypeCommandsByDeviceTypeRef(db, deviceTypeRef) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  DEVICE_TYPE_CLUSTER.CLUSTER_REF,
  DEVICE_TYPE_COMMAND.DEVICE_TYPE_CLUSTER_REF,
  DEVICE_TYPE_COMMAND.COMMAND_REF,
  DEVICE_TYPE_COMMAND.COMMAND_NAME
FROM
  DEVICE_TYPE_COMMAND,
  DEVICE_TYPE_CLUSTER
WHERE
  DEVICE_TYPE_CLUSTER.DEVICE_TYPE_REF = ?
  AND DEVICE_TYPE_CLUSTER.DEVICE_TYPE_CLUSTER_ID = DEVICE_TYPE_COMMAND.DEVICE_TYPE_CLUSTER_REF`,
      [deviceTypeRef]
    )
    .then((rows) => rows.map(dbMapping.map.deviceTypeCommand))
}

/**
 * After loading up device type cluster table with the names,
 * this method links the refererence to actual cluster reference.
 *
 * @param {*} db
 * @returns promise of completion
 */
async function updateClusterReferencesForDeviceTypeClusters(db) {
  return dbApi.dbUpdate(
    db,
    `
UPDATE
  DEVICE_TYPE_CLUSTER
SET
  CLUSTER_REF =
  ( SELECT
      CLUSTER.CLUSTER_ID
    FROM
      CLUSTER
    WHERE lower(CLUSTER.NAME) = lower(DEVICE_TYPE_CLUSTER.CLUSTER_NAME)
  )`,
    []
  )
}

/**
 * After loading up device type attribute table with the names,
 * this method links the refererence to actual attribute reference.
 *
 * @param {*} db
 * @returns promise of completion
 */
async function updateAttributeReferencesForDeviceTypeReferences(db) {
  return dbApi.dbUpdate(
    db,
    `
UPDATE
  DEVICE_TYPE_ATTRIBUTE
SET
  ATTRIBUTE_REF =
  ( SELECT
      ATTRIBUTE.ATTRIBUTE_ID
    FROM
      ATTRIBUTE
    WHERE upper(ATTRIBUTE.DEFINE) = upper(DEVICE_TYPE_ATTRIBUTE.ATTRIBUTE_NAME)
  )`,
    []
  )
}

/**
 * After loading up device type command table with the names,
 * this method links the refererence to actual command reference.
 *
 * @param {*} db
 * @returns promise of completion
 */
async function updateCommandReferencesForDeviceTypeReferences(db) {
  return dbApi.dbUpdate(
    db,
    `
UPDATE
  DEVICE_TYPE_COMMAND
SET
  COMMAND_REF =
  ( SELECT
      COMMAND.COMMAND_ID
    FROM
      COMMAND
    WHERE upper(COMMAND.NAME) = upper(DEVICE_TYPE_COMMAND.COMMAND_NAME)
  )`,
    []
  )
}

/**
 * This method returns the promise of linking the device type clusters
 * commands and attributes to the correct IDs in the cluster, attribute
 * and command tables.
 *
 * Initial load only populates the names, so once everything is loaded,
 * we have to link the foreign keys.
 *
 * @param {*} db
 * @returns promise of completed linking
 */
async function updateDeviceTypeEntityReferences(db) {
  return updateClusterReferencesForDeviceTypeClusters(db)
    .then((res) => updateAttributeReferencesForDeviceTypeReferences(db))
    .then((res) => updateCommandReferencesForDeviceTypeReferences(db))
}

const ATOMIC_QUERY = `
SELECT
  ATOMIC_IDENTIFIER,
  NAME,
  DESCRIPTION,
  ATOMIC_SIZE,
  IS_DISCRETE,
  IS_STRING,
  IS_LONG,
  IS_CHAR,
  IS_SIGNED
FROM ATOMIC
`

/**
 * Locates atomic type based on a type name.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} typeName
 */
async function selectAtomicType(db, packageId, typeName) {
  return dbApi
    .dbGet(db, `${ATOMIC_QUERY} WHERE PACKAGE_REF = ? AND NAME = ?`, [
      packageId,
      typeName == null ? typeName : typeName.toLowerCase(),
    ])
    .then(dbMapping.map.atomic)
}

/**
 * Retrieve the atomic by name, returning promise that resolves into an atomic, or null.
 * @param {*} db
 * @param {*} name
 * @param {*} packageId
 */
async function selectAtomicByName(db, name, packageId) {
  return dbApi
    .dbGet(db, `${ATOMIC_QUERY} WHERE PACKAGE_REF = ? AND NAME = ?`, [
      packageId,
      name,
    ])
    .then(dbMapping.map.atomic)
}

/**
 * Retrieves all atomic types under a given package Id.
 * @param {*} db
 * @param {*} packageId
 */
async function selectAllAtomics(db, packageId) {
  return dbApi
    .dbAll(
      db,
      `${ATOMIC_QUERY} WHERE PACKAGE_REF = ? ORDER BY ATOMIC_IDENTIFIER`,
      [packageId]
    )
    .then((rows) => rows.map(dbMapping.map.atomic))
}

/**
 * Retrieves the size from atomic type.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} type
 */
async function getAtomicSizeFromType(db, packageId, type) {
  return dbApi
    .dbGet(
      db,
      'SELECT ATOMIC_SIZE FROM ATOMIC WHERE PACKAGE_REF = ? AND NAME = ?',
      [packageId, type]
    )
    .then((row) => {
      if (row == null) return null
      else return row.ATOMIC_SIZE
    })
}

/**
 * Exports clusters and endpoint ids
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that contains cluster
 * and endpoint id references
 */
async function exportClustersAndEndpointDetailsFromEndpointTypes(
  db,
  endpointTypes
) {
  let endpointTypeIds = endpointTypes.map((ep) => ep.endpointTypeId).toString()
  let mapFunction = (x) => {
    return {
      endpointId: x.ENDPOINT_TYPE_REF,
      endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
      endpointTypeClusterRef: x.CLUSTER_REF,
    }
  }

  return dbApi
    .dbAll(
      db,
      `
SELECT
  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF,
  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,
  ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
FROM 
  CLUSTER
INNER JOIN 
  ENDPOINT_TYPE_CLUSTER
ON 
  CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
WHERE
  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (${endpointTypeIds})`
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Returns a promise of data for commands inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the command data.
 */
async function exportCommandDetailsFromAllEndpointTypesAndClusters(
  db,
  endpointsAndClusters
) {
  let endpointTypeIds = endpointsAndClusters
    .map((ep) => ep.endpointId)
    .toString()
  let endpointClusterIds = endpointsAndClusters
    .map((ep) => ep.endpointClusterId)
    .toString()
  let mapFunction = (x) => {
    return {
      id: x.COMMAND_ID,
      name: x.NAME,
      code: x.CODE,
      commandSource: x.SOURCE,
      mfgCode: x.MANUFACTURER_CODE,
      incoming: x.INCOMING,
      outgoing: x.OUTGOING,
      description: x.DESCRIPTION,
      clusterSide: x.SIDE,
      clusterName: x.CLUSTER_NAME,
      isClusterEnabled: x.ENABLED,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    COMMAND.COMMAND_ID,
    COMMAND.NAME,
    COMMAND.CODE,
    COMMAND.SOURCE,
    COMMAND.MANUFACTURER_CODE,
    ENDPOINT_TYPE_COMMAND.INCOMING,
    ENDPOINT_TYPE_COMMAND.OUTGOING,
    COMMAND.DESCRIPTION,
    ENDPOINT_TYPE_CLUSTER.SIDE,
    CLUSTER.NAME AS CLUSTER_NAME,
    ENDPOINT_TYPE_CLUSTER.ENABLED
  FROM COMMAND
  INNER JOIN ENDPOINT_TYPE_COMMAND
  ON COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF
  INNER JOIN ENDPOINT_TYPE_CLUSTER
  ON ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
  INNER JOIN CLUSTER
  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID
  WHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (${endpointTypeIds}) AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF in (${endpointClusterIds})
  GROUP BY COMMAND.NAME
        `
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Returns a promise of data for manufacturing/non-manufacturing specific commands
 * inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing/non-manufacturing
 * specific command data.
 */
async function exportCommandDetailsFromAllEndpointTypesAndClustersUtil(
  db,
  endpointsAndClusters,
  isManufacturingSpecific
) {
  let endpointTypeIds = endpointsAndClusters
    .map((ep) => ep.endpointId)
    .toString()
  let endpointClusterIds = endpointsAndClusters
    .map((ep) => ep.endpointClusterId)
    .toString()
  let mapFunction = (x) => {
    return {
      id: x.COMMAND_ID,
      name: x.NAME,
      code: x.CODE,
      commandSource: x.SOURCE,
      mfgCode: x.MANUFACTURER_CODE,
      incoming: x.INCOMING,
      outgoing: x.OUTGOING,
      description: x.DESCRIPTION,
      clusterSide: x.SIDE,
      clusterName: x.CLUSTER_NAME,
      isClusterEnabled: x.ENABLED,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    COMMAND.COMMAND_ID,
    COMMAND.NAME,
    COMMAND.CODE,
    COMMAND.SOURCE,
    COMMAND.MANUFACTURER_CODE,
    ENDPOINT_TYPE_COMMAND.INCOMING,
    ENDPOINT_TYPE_COMMAND.OUTGOING,
    COMMAND.DESCRIPTION,
    ENDPOINT_TYPE_CLUSTER.SIDE,
    CLUSTER.NAME AS CLUSTER_NAME,
    ENDPOINT_TYPE_CLUSTER.ENABLED
  FROM COMMAND
  INNER JOIN ENDPOINT_TYPE_COMMAND
  ON COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF
  INNER JOIN ENDPOINT_TYPE_CLUSTER
  ON ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
  INNER JOIN CLUSTER
  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID
  WHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (${endpointTypeIds})
  AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF in (${endpointClusterIds})
  AND COMMAND.MANUFACTURER_CODE IS` +
        (isManufacturingSpecific ? ` NOT ` : ` `) +
        `NULL
  GROUP BY COMMAND.NAME
        `
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Returns a promise of data for manufacturing specific commands inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing specific command data.
 */
async function exportManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters(
  db,
  endpointsAndClusters
) {
  return exportCommandDetailsFromAllEndpointTypesAndClustersUtil(
    db,
    endpointsAndClusters,
    true
  )
}

/**
 * Returns a promise of data for commands with no manufacturing specific information inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the non-manufacturing specific command data.
 */
async function exportNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters(
  db,
  endpointsAndClusters
) {
  return exportCommandDetailsFromAllEndpointTypesAndClustersUtil(
    db,
    endpointsAndClusters,
    false
  )
}

/**
 * Returns a promise of data for manufacturing/non-manufacturing specific attributes
 * inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing/non-manufacturing
 * specific attribute data.
 */
async function exportAttributeDetailsFromAllEndpointTypesAndClustersUtil(
  db,
  endpointsAndClusters,
  isManufacturingSpecific
) {
  let endpointTypeIds = endpointsAndClusters
    .map((ep) => ep.endpointId)
    .toString()
  let endpointClusterIds = endpointsAndClusters
    .map((ep) => ep.endpointClusterId)
    .toString()
  let mapFunction = (x) => {
    return {
      id: x.ATTRIBUTE_ID,
      name: x.NAME,
      code: x.CODE,
      side: x.SIDE,
      type: x.TYPE,
      define: x.DEFINE,
      mfgCode: x.MANUFACTURER_CODE,
      clusterSide: x.SIDE,
      clusterName: x.CLUSTER_NAME,
      isClusterEnabled: x.ENABLED,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    ATTRIBUTE.ATTRIBUTE_ID,
    ATTRIBUTE.NAME,
    ATTRIBUTE.CODE,
    ATTRIBUTE.SIDE,
    ATTRIBUTE.TYPE,
    ATTRIBUTE.DEFINE,
    ATTRIBUTE.MANUFACTURER_CODE,
    ENDPOINT_TYPE_CLUSTER.SIDE,
    CLUSTER.NAME AS CLUSTER_NAME,
    ENDPOINT_TYPE_CLUSTER.ENABLED
  FROM ATTRIBUTE
  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE
  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF
  INNER JOIN ENDPOINT_TYPE_CLUSTER
  ON ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF = ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
  INNER JOIN CLUSTER
  ON ATTRIBUTE.CLUSTER_REF = CLUSTER.CLUSTER_ID
  WHERE ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_REF IN (${endpointTypeIds})
  AND ENDPOINT_TYPE_ATTRIBUTE.ENDPOINT_TYPE_CLUSTER_REF in (${endpointClusterIds})
  AND ATTRIBUTE.MANUFACTURER_CODE IS` +
        (isManufacturingSpecific ? ` NOT ` : ` `) +
        `NULL
  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1
  GROUP BY ATTIRBUTE.NAME
        `
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Returns a promise of data for manufacturing specific attributes inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the manufacturing specific attribute data.
 */
async function exportManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters(
  db,
  endpointsAndClusters
) {
  return exportAttributeDetailsFromAllEndpointTypesAndClustersUtil(
    db,
    endpointsAndClusters,
    true
  )
}

/**
 * Returns a promise of data for attributes with no manufacturing specific information inside an endpoint type.
 *
 * @param db
 * @param endpointTypeId
 * @returns Promise that resolves with the non-manufacturing specific attribute data.
 */
async function exportNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters(
  db,
  endpointsAndClusters
) {
  return exportAttributeDetailsFromAllEndpointTypesAndClustersUtil(
    db,
    endpointsAndClusters,
    false
  )
}

/**
 * Returns a promise of data for commands inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the command data.
 */
async function exportAllCommandDetailsFromEnabledClusters(
  db,
  endpointsAndClusters
) {
  let endpointTypeClusterRef = endpointsAndClusters
    .map((ep) => ep.endpointTypeClusterRef)
    .toString()
  let mapFunction = (x) => {
    return {
      id: x.COMMAND_ID,
      name: x.NAME,
      code: x.CODE,
      commandSource: x.SOURCE,
      mfgCode: x.MANUFACTURER_CODE,
      description: x.DESCRIPTION,
      clusterSide: x.SIDE,
      clusterName: x.CLUSTER_NAME,
      isClusterEnabled: x.ENABLED,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    COMMAND.COMMAND_ID,
    COMMAND.NAME,
    COMMAND.CODE,
    COMMAND.SOURCE,
    COMMAND.MANUFACTURER_CODE,
    COMMAND.DESCRIPTION,
    ENDPOINT_TYPE_CLUSTER.SIDE,
    CLUSTER.NAME AS CLUSTER_NAME,
    ENDPOINT_TYPE_CLUSTER.ENABLED
  FROM COMMAND
  INNER JOIN CLUSTER
  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID
  INNER JOIN ENDPOINT_TYPE_CLUSTER
  ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
  WHERE ENDPOINT_TYPE_CLUSTER.CLUSTER_REF in (${endpointTypeClusterRef})
  GROUP BY COMMAND.NAME
        `
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Returns a promise of data for attributes inside an endpoint type.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the attribute data.
 */
async function exportAllAttributeDetailsFromEnabledClusters(
  db,
  endpointsAndClusters
) {
  let endpointTypeClusterRef = endpointsAndClusters
    .map((ep) => ep.endpointTypeClusterRef)
    .toString()
  let mapFunction = (x) => {
    return {
      id: x.ATTRIBUTE_ID,
      name: x.NAME,
      code: x.CODE,
      side: x.SIDE,
      type: x.TYPE,
      define: x.DEFINE,
      mfgCode: x.MANUFACTURER_CODE,
      clusterSide: x.SIDE,
      clusterName: x.CLUSTER_NAME,
      isClusterEnabled: x.ENABLED,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    ATTRIBUTE.ATTRIBUTE_ID,
    ATTRIBUTE.NAME,
    ATTRIBUTE.CODE,
    ATTRIBUTE.SIDE,
    ATTRIBUTE.TYPE,
    ATTRIBUTE.DEFINE,
    ATTRIBUTE.MANUFACTURER_CODE,
    ENDPOINT_TYPE_CLUSTER.SIDE,
    CLUSTER.NAME AS CLUSTER_NAME,
    ENDPOINT_TYPE_CLUSTER.ENABLED
  FROM ATTRIBUTE
  INNER JOIN ENDPOINT_TYPE_ATTRIBUTE
  ON ATTRIBUTE.ATTRIBUTE_ID = ENDPOINT_TYPE_ATTRIBUTE.ATTRIBUTE_REF
  INNER JOIN CLUSTER
  ON ATTRIBUTE.CLUSTER_REF = CLUSTER.CLUSTER_ID
  INNER JOIN ENDPOINT_TYPE_CLUSTER
  ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
  WHERE ENDPOINT_TYPE_CLUSTER.CLUSTER_REF in (${endpointTypeClusterRef})
  AND ENDPOINT_TYPE_ATTRIBUTE.INCLUDED = 1
  GROUP BY ATTRIBUTE.NAME
        `
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 *
 * @param db
 * @param endpointsAndClusters
 * @returns  Returns a promise of data for commands with cli inside an endpoint type.
 */
async function exportAllCliCommandDetailsFromEnabledClusters(
  db,
  endpointsAndClusters
) {
  let endpointTypeClusterRef = endpointsAndClusters
    .map((ep) => ep.endpointTypeClusterRef)
    .toString()
  let mapFunction = (x) => {
    return {
      id: x.COMMAND_ID,
      name: x.NAME,
      code: x.CODE,
      commandSource: x.SOURCE,
      mfgCode: x.MANUFACTURER_CODE,
      description: x.DESCRIPTION,
      clusterSide: x.SIDE,
      clusterName: x.CLUSTER_NAME,
      isClusterEnabled: x.ENABLED,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    COMMAND.COMMAND_ID,
    COMMAND.NAME,
    COMMAND.CODE,
    COMMAND.SOURCE,
    COMMAND.MANUFACTURER_CODE,
    COMMAND.DESCRIPTION,
    ENDPOINT_TYPE_CLUSTER.SIDE,
    CLUSTER.NAME AS CLUSTER_NAME,
    ENDPOINT_TYPE_CLUSTER.ENABLED
  FROM COMMAND
  INNER JOIN CLUSTER
  ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID
  INNER JOIN ENDPOINT_TYPE_CLUSTER
  ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
  INNER JOIN PACKAGE_OPTION
  ON PACKAGE_OPTION.OPTION_CODE = COMMAND.NAME
  WHERE ENDPOINT_TYPE_CLUSTER.CLUSTER_REF in (${endpointTypeClusterRef}) AND ENDPOINT_TYPE_CLUSTER.ENABLED=1
  GROUP BY COMMAND.NAME, CLUSTER.NAME
        `
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Get the number of command arguments for a command
 *
 * @param {*} db
 * @param {*} commandId
 * @param {*} [packageId=null]
 * @returns A promise with number of command arguments for a command
 */
async function selectCommandArgumentsCountByCommandId(db, commandId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT COUNT(*) AS count
FROM COMMAND_ARG WHERE COMMAND_REF = ? `,
      [commandId]
    )
    .then((res) => res[0].count)
}

/**
 * Extract the command arguments for a command
 *
 * @param {*} db
 * @param {*} commandId
 * @param {*} [packageId=null]
 * @returns A promise with command arguments for a command
 */
async function selectCommandArgumentsByCommandId(db, commandId) {
  return dbApi
    .dbAll(
      db,
      `
SELECT
  COMMAND_REF,
  NAME,
  TYPE,
  IS_ARRAY,
  PRESENT_IF,
  INTRODUCED_IN_REF,
  REMOVED_IN_REF,
  COUNT_ARG
FROM COMMAND_ARG WHERE COMMAND_REF = ?
ORDER BY ORDINAL`,
      [commandId]
    )
    .then((rows) => rows.map(dbMapping.map.commandArgument))
}

/**
 * Returns a promise that resolves into one of the zclType enum
 * values.
 *
 * @param {*} db
 * @param {*} packageId
 * @param {*} type
 */
async function determineType(db, type, packageId) {
  let atomic = await selectAtomicByName(db, type, packageId)
  if (atomic != null) return dbEnum.zclType.atomic

  let theEnum = await selectEnumByName(db, type, packageId)
  if (theEnum != null) return dbEnum.zclType.enum

  let struct = await selectStructByName(db, type, packageId)
  if (struct != null) return dbEnum.zclType.struct

  let theBitmap = await selectBitmapByName(db, packageId, type)
  if (theBitmap != null) return dbEnum.zclType.bitmap

  return dbEnum.zclType.unknown
}

/**
 * Exports clusters to an externalized form.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
async function exportAllClustersDetailsFromEndpointTypes(db, endpointTypes) {
  let endpointTypeIds = endpointTypes.map((ep) => ep.endpointTypeId).toString()
  let mapFunction = (x) => {
    return {
      id: x.CLUSTER_ID,
      name: x.NAME,
      code: x.CODE,
      define: x.DEFINE,
      mfgCode: x.MANUFACTURER_CODE,
      side: x.SIDE,
      enabled: x.ENABLED,
      endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
      endpointCount: x['COUNT(*)'],
    }
  }

  return dbApi
    .dbAll(
      db,
      `
SELECT
  CLUSTER.CLUSTER_ID,
  CLUSTER.CODE,
  CLUSTER.MANUFACTURER_CODE,
  CLUSTER.NAME,
  CLUSTER.DEFINE,
  ENDPOINT_TYPE_CLUSTER.SIDE,
  ENDPOINT_TYPE_CLUSTER.ENABLED,
  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID,
  COUNT(*)
FROM CLUSTER
INNER JOIN ENDPOINT_TYPE_CLUSTER
ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
WHERE ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (${endpointTypeIds})
AND ENDPOINT_TYPE_CLUSTER.SIDE IS NOT "" AND ENDPOINT_TYPE_CLUSTER.ENABLED=1
GROUP BY NAME, SIDE`
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Exports clusters to an externalized form irrespecive of side.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
async function exportAllClustersDetailsIrrespectiveOfSideFromEndpointTypes(
  db,
  endpointTypes
) {
  let endpointTypeIds = endpointTypes.map((ep) => ep.endpointTypeId).toString()
  let mapFunction = (x) => {
    return {
      id: x.CLUSTER_ID,
      name: x.NAME,
      code: x.CODE,
      define: x.DEFINE,
      mfgCode: x.MANUFACTURER_CODE,
      side: x.SIDE,
      enabled: x.ENABLED,
      endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
    }
  }

  return dbApi
    .dbAll(
      db,
      `
SELECT
  CLUSTER.CLUSTER_ID,
  CLUSTER.CODE,
  CLUSTER.MANUFACTURER_CODE,
  CLUSTER.NAME,
  CLUSTER.DEFINE,
  ENDPOINT_TYPE_CLUSTER.SIDE,
  ENDPOINT_TYPE_CLUSTER.ENABLED,
  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
FROM CLUSTER
INNER JOIN ENDPOINT_TYPE_CLUSTER
ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
WHERE ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (${endpointTypeIds})
AND ENDPOINT_TYPE_CLUSTER.SIDE IS NOT "" AND ENDPOINT_TYPE_CLUSTER.ENABLED=1
GROUP BY NAME`
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Exports clusters to an externalized form without duplicates caused by side.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the data that should go into the external form.
 */
async function exportAllClustersNamesFromEndpointTypes(db, endpointTypes) {
  let endpointTypeIds = endpointTypes.map((ep) => ep.endpointTypeId).toString()
  let mapFunction = (x) => {
    return {
      id: x.CLUSTER_ID,
      name: x.NAME,
      code: x.CODE,
      define: x.DEFINE,
      mfgCode: x.MANUFACTURER_CODE,
      enabled: x.ENABLED,
      endpointClusterId: x.ENDPOINT_TYPE_CLUSTER_ID,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
SELECT
  CLUSTER.CLUSTER_ID,
  CLUSTER.CODE,
  CLUSTER.MANUFACTURER_CODE,
  CLUSTER.NAME,
  CLUSTER.DEFINE,
  ENDPOINT_TYPE_CLUSTER.SIDE,
  ENDPOINT_TYPE_CLUSTER.ENABLED,
  ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_CLUSTER_ID
FROM CLUSTER
INNER JOIN ENDPOINT_TYPE_CLUSTER
ON CLUSTER.CLUSTER_ID = ENDPOINT_TYPE_CLUSTER.CLUSTER_REF
WHERE ENDPOINT_TYPE_CLUSTER.ENDPOINT_TYPE_REF IN (${endpointTypeIds})
AND ENDPOINT_TYPE_CLUSTER.SIDE IS NOT "" AND ENDPOINT_TYPE_CLUSTER.ENABLED = 1
GROUP BY NAME`
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 * Returns a promise of data for commands inside all existing endpoint types.
 *
 * @param {*} db
 * @param {*} endpointTypeId
 * @returns Promise that resolves with the command data.
 */
async function exportCommandDetailsFromAllEndpointTypeCluster(
  db,
  endpointTypes,
  endpointClusterId
) {
  let endpointTypeIds = endpointTypes.map((ep) => ep.endpointTypeId).toString()
  let mapFunction = (x) => {
    return {
      id: x.COMMAND_ID,
      name: x.NAME,
      code: x.CODE,
      mfgCode: x.MANUFACTURER_CODE,
      incoming: x.INCOMING,
      outgoing: x.OUTGOING,
      description: x.DESCRIPTION,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    COMMAND.COMMAND_ID,
    COMMAND.NAME,
    COMMAND.CODE,
    COMMAND.MANUFACTURER_CODE,
    ENDPOINT_TYPE_COMMAND.INCOMING,
    ENDPOINT_TYPE_COMMAND.OUTGOING,
    COMMAND.DESCRIPTION
  FROM COMMAND
  INNER JOIN ENDPOINT_TYPE_COMMAND
  ON COMMAND.COMMAND_ID = ENDPOINT_TYPE_COMMAND.COMMAND_REF
  WHERE ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_REF IN (${endpointTypeIds}) AND ENDPOINT_TYPE_COMMAND.ENDPOINT_TYPE_CLUSTER_REF = ?
        `,
      [endpointClusterId]
    )
    .then((rows) => rows.map(mapFunction))
}

/**
 *
 * @param db
 * @param endpointClusterId
 * Returns: A promise with all commands with cli for a given cluster id
 */
async function exportCliCommandsFromCluster(db, endpointClusterId) {
  let mapFunction = (x) => {
    return {
      name: x.NAME,
      code: x.CODE,
      mfgCode: x.MANUFACTURER_CODE,
      source: x.SOURCE,
    }
  }
  return dbApi
    .dbAll(
      db,
      `
  SELECT
    COMMAND.NAME,
    COMMAND.CODE,
    COMMAND.MANUFACTURER_CODE,
    COMMAND.SOURCE
    FROM COMMAND
    INNER JOIN CLUSTER
    ON COMMAND.CLUSTER_REF = CLUSTER.CLUSTER_ID
    INNER JOIN PACKAGE_OPTION
    ON PACKAGE_OPTION.OPTION_CODE = COMMAND.NAME
    WHERE CLUSTER.CLUSTER_ID = ?
        `,
      [endpointClusterId]
    )
    .then((rows) => rows.map(mapFunction))
}

// exports
exports.selectAllEnums = selectAllEnums
exports.selectAllEnumItemsById = selectAllEnumItemsById
exports.selectAllEnumItems = selectAllEnumItems
exports.selectEnumById = selectEnumById
exports.selectAllBitmaps = selectAllBitmaps
exports.selectAllBitmapFields = selectAllBitmapFields
exports.selectBitmapById = selectBitmapById
exports.selectAllDomains = selectAllDomains
exports.selectDomainById = selectDomainById
exports.selectAtomicByName = selectAtomicByName
exports.selectAllStructs = selectAllStructs
exports.selectStructById = selectStructById
exports.selectAllStructItemsById = selectAllStructItemsById
exports.selectAllStructItemsByStructName = selectAllStructItemsByStructName
exports.selectAllClusters = selectAllClusters
exports.selectClusterById = selectClusterById
exports.selectClusterByCode = selectClusterByCode
exports.selectAllDeviceTypes = selectAllDeviceTypes
exports.selectDeviceTypeById = selectDeviceTypeById
exports.selectDeviceTypeByCodeAndName = selectDeviceTypeByCodeAndName
exports.selectAttributesByClusterIdAndSide = selectAttributesByClusterIdAndSide
exports.selectAttributesByClusterId = selectAttributesByClusterId
exports.selectAttributesByClusterCodeAndManufacturerCode = selectAttributesByClusterCodeAndManufacturerCode
exports.selectAttributeById = selectAttributeById
exports.selectAttributeByAttributeIdAndClusterRef = selectAttributeByAttributeIdAndClusterRef
exports.selectAllAttributes = selectAllAttributes
exports.selectAllAttributesBySide = selectAllAttributesBySide
exports.selectCommandById = selectCommandById
exports.selectCommandsByClusterId = selectCommandsByClusterId
exports.selectAllCommands = selectAllCommands
exports.selectAllGlobalCommands = selectAllGlobalCommands
exports.selectAllClusterCommands = selectAllClusterCommands
exports.selectAllCommandArguments = selectAllCommandArguments
exports.selectEndpointTypeClustersByEndpointTypeId = selectEndpointTypeClustersByEndpointTypeId
exports.selectEndpointTypeAttributesByEndpointId = selectEndpointTypeAttributesByEndpointId
exports.selectEndpointTypeAttribute = selectEndpointTypeAttribute
exports.selectEndpointTypeCommandsByEndpointId = selectEndpointTypeCommandsByEndpointId
exports.selectDeviceTypeClustersByDeviceTypeRef = selectDeviceTypeClustersByDeviceTypeRef
exports.selectDeviceTypeClusterByDeviceTypeClusterId = selectDeviceTypeClusterByDeviceTypeClusterId
exports.selectDeviceTypeAttributesByDeviceTypeClusterRef = selectDeviceTypeAttributesByDeviceTypeClusterRef
exports.selectDeviceTypeCommandsByDeviceTypeClusterRef = selectDeviceTypeCommandsByDeviceTypeClusterRef
exports.selectDeviceTypeAttributesByDeviceTypeRef = selectDeviceTypeAttributesByDeviceTypeRef
exports.selectDeviceTypeCommandsByDeviceTypeRef = selectDeviceTypeCommandsByDeviceTypeRef
exports.updateDeviceTypeEntityReferences = updateDeviceTypeEntityReferences
exports.selectEndpointType = selectEndpointType
exports.selectAllAtomics = selectAllAtomics
exports.getAtomicSizeFromType = getAtomicSizeFromType
exports.selectAtomicType = selectAtomicType
exports.selectAllBitmapFieldsById = selectAllBitmapFieldsById
exports.selectBitmapByName = selectBitmapByName
exports.exportClustersAndEndpointDetailsFromEndpointTypes = exportClustersAndEndpointDetailsFromEndpointTypes
exports.exportCommandDetailsFromAllEndpointTypesAndClusters = exportCommandDetailsFromAllEndpointTypesAndClusters
exports.selectCommandArgumentsCountByCommandId = selectCommandArgumentsCountByCommandId
exports.selectCommandArgumentsByCommandId = selectCommandArgumentsByCommandId
exports.exportAllClustersDetailsFromEndpointTypes = exportAllClustersDetailsFromEndpointTypes
exports.exportAllClustersNamesFromEndpointTypes = exportAllClustersNamesFromEndpointTypes
exports.exportCommandDetailsFromAllEndpointTypeCluster = exportCommandDetailsFromAllEndpointTypeCluster
exports.selectEnumByName = selectEnumByName
exports.selectStructByName = selectStructByName
exports.determineType = determineType
exports.selectCommandTree = selectCommandTree
exports.exportAllCommandDetailsFromEnabledClusters = exportAllCommandDetailsFromEnabledClusters
exports.exportAllClustersDetailsIrrespectiveOfSideFromEndpointTypes = exportAllClustersDetailsIrrespectiveOfSideFromEndpointTypes
exports.exportManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters = exportManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters
exports.exportNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters = exportNonManufacturerSpecificCommandDetailsFromAllEndpointTypesAndClusters
exports.exportAllCliCommandDetailsFromEnabledClusters = exportAllCliCommandDetailsFromEnabledClusters
exports.exportCliCommandsFromCluster = exportCliCommandsFromCluster
exports.exportAllAttributeDetailsFromEnabledClusters = exportAllAttributeDetailsFromEnabledClusters
exports.exportManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters = exportManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters
exports.exportNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters = exportNonManufacturerSpecificAttributeDetailsFromAllEndpointTypesAndClusters
