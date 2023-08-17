<template>
  <v-card v-bind="$attrs">
    <v-card-title v-if="isTitled">
      {{ fieldSet.label || "Настройки" }}</v-card-title
    >
    <v-card-subtitle v-if="isDev && relativeKey">
      <DevInfo :path="slotName('', relativeKey)" />
    </v-card-subtitle>
    <v-card-text>
      <v-expansion-panels v-model="openedPanels" accordion multiple focusable>
        <slot
          v-for="key in fieldSetKeys"
          :item="value[key]"
          :meta="currentFieldSet[key]"
          :relativeKey="relativeKey"
          :currentKey="key"
          :name="slotName(relativeKey, key)"
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h3>{{ currentFieldSet[key].label || "Настройки" }}</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <FieldSet
                elevation="0"
                :isTitled="false"
                :exclude="
                  excludeObject[key]
                    ? [excludeObject[key], ...newExclude]
                    : newExclude
                "
                :isDev="isDev"
                :defaultOpened="
                  panelsObject[key]
                    ? [panelsObject[key], ...newPanels]
                    : newPanels
                "
                :fieldSet="currentFieldSet[key]"
                :orderKeys="
                  orderKeys && orderKeys.hasOwnProperty(key)
                    ? orderKeys[key]
                    : undefined
                "
                :relativeKey="relativeKey ? `${relativeKey}.${key}` : key"
                @validate="(v) => $emit('validate', v)"
                v-model="value[key]"
              >
                <template
                  v-for="(_, name) in $scopedSlots"
                  v-slot:[name]="data"
                >
                  <slot :name="name" v-bind="data" />
                </template>
              </FieldSet>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </slot>
      </v-expansion-panels>
      <v-row dense :class="[fieldSetKeys.length ? 'mt-5' : '']">
        <v-col
          class="col-12"
          v-if="$scopedSlots[slotName(relativeKey, 'header')]"
        >
          <slot :name="slotName(relativeKey, 'header')" :item="value" />
        </v-col>
        <v-col
          v-for="(key, idx) in primitiveKeys"
          :key="idx"
          :class="[
            primitiveKeys.length % 2 == 0 && !isMobile ? 'col-6' : 'col-12',
          ]"
        >
          <DevInfo :path="slotName(relativeKey, key)" v-if="isDev" />

          <slot
            :name="slotName(relativeKey, key)"
            :meta="currentFieldSet[key]"
            :item="value[key]"
            :relativeKey="relativeKey"
            :currentKey="key"
            :setattr="(value) => updateValue(key, value)"
          >
            <Primitive
              :isDev="isDev"
              @validate="
                (v) =>
                  $emit('validate', {
                    value: v,
                    field: relativeKey ? `${relativeKey}.${key}` : `${key}`,
                  })
              "
              :meta="currentFieldSet[key]"
              v-model="value[key]"
            >
            </Primitive>
          </slot>
        </v-col>

        <v-col
          class="col-12"
          v-if="$scopedSlots[slotName(relativeKey, 'footer')]"
        >
          <slot :name="slotName(relativeKey, 'footer')" :item="value"></slot>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="$scopedSlots[slotName(relativeKey, 'action')]">
      <slot :name="slotName(relativeKey, 'action')" :item="value"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import Primitive from "./Primitive.vue";
import DevInfo from "./ui/DevInfo.vue";
export default {
  components: { Primitive, DevInfo },
  name: "FieldSet",
  props: {
    value: Object,
    fieldSet: { type: Object, default: () => {} },
    exclude: { type: Array, default: () => [] },
    relativeKey: { type: String, default: undefined },
    isDev: { type: Boolean, default: false },
    isTitled: { type: Boolean, default: true },
    defaultOpened: { type: Array, default: () => [] },
    orderKeys: {},
  },
  data() {
    return {
      openedPanels: [],
    };
  },
  mounted() {
    this.primitiveKeys.forEach((element) => {
      this.value[element];
    });
    this.setCurrentOpenedPanels(this.currentPanels);
  },
  methods: {
    slotName(relative, current) {
      return (relative ? `${relative}-${current}` : current) + "-slot";
    },
    updateValue(key, newValue) {
      this.value[key] = newValue;
      this.$emit("validate", {
        value: newValue,
        field: this.relativeKey ? `${this.relativeKey}.${key}` : `${key}`,
      });
    },
    dotSplit(list) {
      return list?.map((x) => x.split("."));
    },
    dotJoin(list) {
      return list.map((x) => x.join("."));
    },
    filterCurrent(list) {
      return list.filter((x) => x.length == 1);
    },
    setCurrentOpenedPanels(list) {
      this.fieldSetKeys.forEach((x, idx) => {
        if (list.includes(x)) {
          this.openedPanels.push(idx);
        }
      });
    },
    getInsetObject(list) {
      return list.reduce((acc, currentValue) => {
        if (currentValue.length > 1) {
          return {
            ...acc,
            ...Object.fromEntries([
              [
                currentValue[0],
                currentValue.splice(1, currentValue.length).join("."),
              ],
            ]),
          };
        } else {
          return acc;
        }
      }, {});
    },
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true;
        case "md":
        case "lg":
        case "xl":
          return false;
      }
    },
    splittedExclude() {
      return this.dotSplit(this.exclude);
    },
    currentExclude() {
      return this.dotJoin(this.filterCurrent(this.splittedExclude));
    },
    newExclude() {
      return this.dotJoin(this.splittedExclude);
    },
    excludeObject() {
      return this.getInsetObject(this.splittedExclude);
    },
    splittedPanels() {
      return this.dotSplit(this.defaultOpened);
    },
    currentPanels() {
      return this.dotJoin(this.filterCurrent(this.splittedPanels));
    },
    newPanels() {
      return this.dotJoin(this.splittedPanels);
    },
    panelsObject() {
      return this.getInsetObject(this.splittedPanels);
    },
    metaKeys() {
      let keys = [];
      if (this.orderKeys) {
        let currentOrder = Array.isArray(this.orderKeys)
          ? this.orderKeys
          : Object.keys(this.orderKeys);
        currentOrder.forEach((key) => {
          if (this.currentFieldSet.hasOwnProperty(key)) {
            keys[key] = this.currentFieldSet[key];
          }
        });
        Object.keys(this.currentFieldSet).forEach((key) => {
          if (!keys.hasOwnProperty(key)) {
            keys[key] = this.currentFieldSet[key];
          }
        });
      } else {
        keys = this.currentFieldSet;
      }
      return Object.keys(keys).filter(
        (key) => !this.currentExclude.includes(key)
      );
    },
    primitiveKeys() {
      return this.metaKeys.filter(
        (key) => this.currentFieldSet[key].is_primitive
      );
    },
    fieldSetKeys() {
      return this.metaKeys.filter(
        (key) => !this.currentFieldSet[key].is_primitive
      );
    },
    iterableKeys() {
      return this.metaKeys.filter(
        (key) => this.currentFieldSet[key].is_iterable
      );
    },
    currentFieldSet() {
      return this.fieldSet.type || this.fieldSet;
    },
  },
};
</script>

<style>
</style>