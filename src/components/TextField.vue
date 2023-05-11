<template>
  <v-text-field
    v-if="!multiline"
    outlined
    :clearable="clearable"
    dense
    filled
    :type="password ? (pwd_shown ? type : 'password') : type"
    @keydown="activity"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    :class="{ changed: is_changed }"
  >
    <template v-slot:prepend-inner v-if="password">
      <v-btn small icon tabindex="-1" @click="pwd_shown = !pwd_shown">
        <v-icon v-if="pwd_shown">mdi-eye-off</v-icon>
        <v-icon v-else>mdi-eye</v-icon>
      </v-btn>
    </template>

    <template v-slot:prepend-inner v-else>
      <v-icon>{{ prependInnerIcon }}</v-icon>
    </template>

    <template v-slot:prepend v-if="hint">
      <v-tooltip top right>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
        </template>
        <span style="white-space: pre-wrap" v-html="hint"></span>
      </v-tooltip>
    </template>

    <template #append-outer>
      <slot name="append-outer" />
    </template>
  </v-text-field>
  <v-textarea
    v-else
    outlined
    :clearable="clearable"
    dense
    filled
    @keydown="activity"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    :class="{ changed: is_changed }"
  >
    <template v-slot:prepend-inner>
      <v-icon>{{ prependInnerIcon }}</v-icon>
    </template>

    <template v-slot:prepend v-if="hint">
      <v-tooltip top right>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
        </template>
        <span style="white-space: pre-wrap" v-html="hint"></span>
      </v-tooltip>
    </template>

    <template #append-outer>
      <slot name="#append-outer" />
    </template>
  </v-textarea>
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
    multiline: Boolean,
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