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

const electronMain = require('../src-electron/main-process/electron-main.js')
const window = require('../src-electron/ui/window.js')

test('Make sure electron main process loads', () => {
  expect(electronMain.loaded).toBeTruthy()
})

test('Test constructing queries for the window', () => {
  let query = window.createQueryString('um', 'em')
  expect(query).toBe(`?uiMode=um`)
  query = window.createQueryString()
  expect(query).toBe(``)
})

require('../src-electron/main-process/preference.js')
