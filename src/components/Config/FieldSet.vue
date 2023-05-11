<template>
  <v-card class="mb-3">
    <v-card-title>{{
      fieldSet.label ? locale(fieldSet.label) : "Настройки"
    }}</v-card-title>
    <v-card-subtitle v-if="isDev && relativeKey">
      <div style="font-size: 13px">
        -- {{ relativeKey + "-slot" }} используется режим разработчика --
      </div>
    </v-card-subtitle>
    <v-card-text>
      <slot v-for="key in fieldSetKeys" :name="slotName(relativeKey, key)">
        <FieldSet
          :exclude="
            excludeObject[key]
              ? [excludeObject[key], ...newExclude]
              : newExclude
          "
          :locale="locale"
          :isDev="isDev"
          :fieldSet="currentFieldSet[key]"
          :relativeKey="relativeKey ? `${relativeKey}.${key}` : key"
          @validate="(v) => $emit('validate', v)"
          v-model="value[key]"
        >
          <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
        </FieldSet>
      </slot>
      <v-row dense>
        <v-col
          class="col-12"
          v-if="$slots[(relativeKey ? `${relativeKey}-` : '') + `header-slot`]"
        >
          <slot
            :name="(relativeKey ? `${relativeKey}-` : '') + `header-slot`"
          />
        </v-col>
        <v-col
          v-for="(key, idx) in primitiveKeys"
          :key="idx"
          :class="[
            primitiveKeys.length % 2 == 0 && !isMobile ? 'col-6' : 'col-12',
          ]"
        >
          <div style="font-size: 13px; min-height: 40px" v-if="isDev">
            -- {{ slotName(relativeKey, key) }} используется режим разработчика
            --
          </div>
          <slot :name="slotName(relativeKey, key)" :value="value[key]">
            <Primitive
              :locale="locale"
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
          v-if="$slots[(relativeKey ? `${relativeKey}-` : '') + `footer-slot`]"
        >
          <slot
            :name="(relativeKey ? `${relativeKey}-` : '') + `footer-slot`"
          ></slot>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <slot :name="relativeKey ? `${relativeKey}-action` : 'action'"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
// @updateValue="(newValue) => {value[key] = newValue; $emit('input',)} "
import Primitive from "./Primitive.vue";
export default {
  props: ["fieldSet", "value", "exclude", "relativeKey", "locale", "isDev"],
  name: "FieldSet",
  components: { Primitive },
  mounted() {
    this.primitiveKeys.forEach((element) => {
      this.value[element];
    });
  },
  methods: {
    slotName(relative, current) {
      return (relative ? `${relative}-${current}` : current) + "-slot";
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