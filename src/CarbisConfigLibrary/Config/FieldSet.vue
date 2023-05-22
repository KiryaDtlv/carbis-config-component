<template>
  <v-card v-bind="$attrs">
    <v-card-title v-if="isTitled">
      {{ fieldSet.label || "Настройки" }}</v-card-title
    >
    <v-card-subtitle v-if="isDev && relativeKey">
      <DevInfo :path="slotName('', relativeKey)" />
    </v-card-subtitle>
    <v-card-text>
      <v-expansion-panels accordion multiple focusable>
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
                :fieldSet="currentFieldSet[key]"
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
      <v-row dense class="mt-2">
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
    <v-card-actions>
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
    fieldSet: { type: Object, default: {} },
    exclude: { type: Array, default: [] },
    relativeKey: { type: String, default: undefined },
    isDev: { type: Boolean, default: false },
    isTitled: { type: Boolean, default: true },
  },
  mounted() {
    this.primitiveKeys.forEach((element) => {
      this.value[element];
    });
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
  },
  computed: {
    splittedExclude() {
      return this.exclude?.map((x) => x.split("."));
    },
    isMobile() {
      console.log(this.$vuetify.breakpoint.name);
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
    currentExclude() {
      return this.splittedExclude
        .filter((x) => x.length == 1)
        .map((x) => x.join("."));
    },
    newExclude() {
      return this.splittedExclude.map((x) => {
        return x.join(".");
      });
    },
    excludeObject() {
      return this.splittedExclude.reduce((acc, currentValue) => {
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
    metaKeys() {
      return Object.keys(this.currentFieldSet).filter(
        (key) => !this.currentExclude.includes(key)
      );
    },
    primitiveKeys() {
      return this.metaKeys
        .filter((key) => this.currentFieldSet[key].is_primitive)
        .sort(
          (a, b) =>
            this.currentFieldSet[a].type.length -
            this.currentFieldSet[b].type.length
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