<!--
Copyright (c) 2008,2020 Silicon Labs.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
  <div>
    <q-card
      :bordered="isSelectedEndpoint"
      @click="setSelectedEndpointType(endpointReference)"
    >
      <div class="vertical-align:middle q-pa-md">
        <strong
          >Endpoint - {{ getFormattedEndpointId(endpointReference) }}</strong
        >
      </div>
      <q-list dense bordered>
        <br />
        <q-item class="row">
          <div class="col-md-6">
            <strong>Device Type</strong>
          </div>
          <div class="col-md-6">
            {{
              deviceType
                ? deviceType.description +
                  ' (' +
                  asHex(deviceType.code, 4) +
                  ')'
                : ''
            }}
          </div>
        </q-item>
        <q-item class="row">
          <div class="col-md-6">
            <strong>Network</strong>
          </div>
          <div class="col-md-6">
            {{ networkId[endpointReference] }}
          </div>
        </q-item>
        <q-item class="row">
          <div class="col-md-6">
            <strong>Profile ID</strong>
          </div>
          <div class="col-md-6">
            {{
              zclDeviceTypes[
                endpointDeviceTypeRef[endpointType[endpointReference]]
              ]
                ? asHex(
                    zclDeviceTypes[
                      endpointDeviceTypeRef[endpointType[endpointReference]]
                    ].profileId,
                    4
                  )
                : ''
            }}
          </div>
        </q-item>
        <q-item class="row">
          <div class="col-md-6">
            <strong>Version</strong>
          </div>
          <div class="col-md-6">{{ endpointVersion[endpointReference] }}</div>
        </q-item>
      </q-list>
      <q-card-actions class="q-gutter-xs">
        <q-btn
          flat
          dense
          label="Delete"
          color="primary"
          v-close-popup
          size="sm"
          icon="delete"
          @click="deleteEpt()"
        />
        <q-btn
          flat
          dense
          label="Edit"
          color="primary"
          icon="edit"
          size="sm"
          v-close-popup
          @click="modifyEndpointDialog = !modifyEndpointDialog"
        />
      </q-card-actions>
    </q-card>
    <q-dialog
      v-model="modifyEndpointDialog"
      class="background-color:transparent"
    >
      <zcl-create-modify-endpoint
        v-bind:endpointReference="endpointReference"
      />
    </q-dialog>
  </div>
</template>

<script>
import ZclCreateModifyEndpoint from './ZclCreateModifyEndpoint.vue'
import CommonMixin from '../util/common-mixin'

export default {
  name: 'ZclEndpointCard',
  props: ['endpointReference'],
  mixins: [CommonMixin],
  components: { ZclCreateModifyEndpoint },
  data() {
    return {
      modifyEndpointDialog: false,
    }
  },
  methods: {
    getFormattedEndpointId(endpointRef) {
      return this.endpointId[endpointRef]
    },
    deleteEpt() {
      let endpointReference = this.endpointReference
      this.$store.dispatch('zap/deleteEndpoint', endpointReference).then(() => {
        this.$store.dispatch(
          'zap/deleteEndpointType',
          this.endpointType[endpointReference]
        )
      })
    },
  },
  computed: {
    deviceType: {
      get() {
        return this.zclDeviceTypes[
          this.endpointDeviceTypeRef[this.endpointType[this.endpointReference]]
        ]
      },
    },
    networkId: {
      get() {
        return this.$store.state.zap.endpointView.networkId
      },
    },
    endpointVersion: {
      get() {
        return this.$store.state.zap.endpointView.endpointVersion
      },
    },
    endpointTypeName: {
      get() {
        return this.$store.state.zap.endpointTypeView.name
      },
    },
    endpointDeviceTypeRef: {
      get() {
        return this.$store.state.zap.endpointTypeView.deviceTypeRef
      },
    },
    zclDeviceTypeOptions: {
      get() {
        return Object.keys(this.$store.state.zap.zclDeviceTypes)
      },
    },
    isSelectedEndpoint: {
      get() {
        return this.selectedEndpointId == this.endpointReference
      },
    },
  },
}
</script>

<style scoped lang="sass">
.q-card
  border-width: 1px
  border-color: $primary
</style>
