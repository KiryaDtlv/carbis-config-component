<template>
  <v-switch
    outlined
    dense
    filled
    :input-value="value"
    @change="(e) => $emit('input', e)"
    v-bind="$attrs"
    v-on="$listeners"
    :class="{ changed: is_changed }"
  >
    <template v-slot:prepend v-if="hint">
      <v-tooltip top right>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
        </template>
        <span style="white-space: pre-wrap" v-html="hint"></span>
      </v-tooltip>
    </template>
  </v-switch>
</template>

<script>
export default {
  props: {
    hint: String,
    value: Boolean,
    changed: Boolean,
    original_value: {
      type: Boolean,
      default: undefined,
    },
  },
  data: () => ({}),
  computed: {
    local_changed() {
      return this.original_value !== undefined
        ? this.original_value != this.value
        : false;
    },
    is_changed() {
      return this.changed || this.local_changed;
    },
  },
};
</script>

<style scoped>
.changed {
  position: relative;
}

.changed::after {
  content: " ";
  color: white;
  text-align: center;
  vertical-align: center;
  padding: 0;
  width: 10px;
  height: 10px;
  position: absolute;
  left: -5px;
  top: -5px;
  border-radius: 50%;
  background: var(--v-warning-base);
}
</style>