<template>
  <v-sheet>
    <v-skeleton-loader
      v-if="loading"
      type="list-item-three-line"
    ></v-skeleton-loader>
    <v-sheet v-else>
      <slot name="test_test-slot"></slot>
      <FieldSet
        :fieldSet="metaConfig"
        :isDev="isDev"
        :exclude="exclude"
        v-model="value"
        @validate="(v) => onValidate(v)"
      >
        <template v-for="(_, name) in $scopedSlots" v-slot:[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </FieldSet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import FieldSet from "./FieldSet.vue";
export default {
  components: { FieldSet },
  props: {
    value: { type: Object, default: () => {} },
    metaConfig: {
      type: Object,
      required: true,
    },
    exclude: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isDev: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      savedState: {},
      updatedState: {},
    };
  },
  mounted() {
    console.log(this.$slots);
    console.log(this.$refs);
    console.log(this.$attrs);
    console.log(this.$scopedSlots);
    console.log(this.$props);
  },

  methods: {
    localization(value) {
      if (this.locale) {
        return this.locale(value) || value;
      } else {
        return value;
      }
    },
    getCopy(value) {
      return JSON.parse(JSON.stringify(value));
    },

    onValidate(value) {
      this.updatedState = this.getDiff(
        { ...this.value },
        { ...this.savedState }
      );
      this.$emit("update", this.updatedState);
      this.$emit("validate", value);
    },
    getDiff(newConfig, oldConfig) {
      const keys = Object.keys(newConfig);
      const updated = {};
      keys.forEach((key) => {
        if (typeof newConfig[key] === "object") {
          const value = this.getDiff(newConfig[key], oldConfig[key]);
          if (Object.keys(value).length) {
            updated[key] = value;
          }
        } else {
          if (newConfig[key] != oldConfig[key]) {
            updated[key] = newConfig[key];
          }
        }
      });
      return updated;
    },
  },
  watch: {
    loading(newValue) {
      if (!newValue) {
        this.savedState = this.getCopy(this.value);
      }
    },
  },
};
</script>