<template>
  <v-autocomplete
    outlined
    :clearable="clearable"
    :no-data-text="'Нет данных'"
    dense
    filled
    @keydown="activity"
    :value="value"
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
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    hint: String,
    "prepend-inner-icon": {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    clearable: {
      type: Boolean,
    },
    password: Boolean,
    changed: Boolean,
    value: [String, Number],
    original_value: {
      type: [String, Number],
      default: undefined,
    },
  },
  data: () => ({
    pwd_shown: false,
    activity_timer: undefined,
  }),
  computed: {
    local_changed() {
      return this.original_value !== undefined
        ? this.value != this.original_value
        : false;
    },
    is_changed() {
      return this.changed || this.local_changed;
    },
  },
  methods: {
    activity() {
      if (this.activity_timer) {
        clearTimeout(this.activity_timer);
      }

      this.activity_timer = setTimeout(() => {
        clearTimeout(this.activity_timer);
        this.$emit("inactive");
      }, 900);
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