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

// The purpose of this file is to populate the api for the entry points from jxbrowser.

import {
  renderer_api_info,
  renderer_api_execute,
  renderer_notify,
} from '../api/renderer_api.js'

window.global_renderer_api_info = renderer_api_info()
window.global_renderer_api_execute = renderer_api_execute
window.global_renderer_notify = renderer_notify
