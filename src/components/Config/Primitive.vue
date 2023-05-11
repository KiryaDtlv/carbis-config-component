<template>
  <v-sheet>
    <slot name="develop"></slot>
    <v-sheet v-if="[typeMap.str, typeMap.int].includes(typeMap[meta.type])">
      <InputField
        v-model="currentValue"
        @change="$emit('validate', currentValue)"
        :label="locale(meta.label)"
        :type="typeMap[meta.type]"
        v-if="!meta.secret"
      >
        <template v-slot:prepend>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
            </template>
            {{ locale(meta.hint) || locale(meta.label) }}
          </v-tooltip>
        </template>
      </InputField>
      <PasswordField
        @change="$emit('validate', currentValue)"
        v-model="currentValue"
        :label="meta.label"
        :type="typeMap[meta.type]"
        v-else
      >
        <template v-slot:prepend>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
            </template>
            {{ locale(meta.hint) || locale(meta.label) }}
          </v-tooltip>
        </template>
      </PasswordField>
    </v-sheet>
    <v-sheet v-else-if="[typeMap.bool].includes(typeMap[meta.type])">
      <CarbisSwitch
        v-model="currentValue"
        :label="locale(meta.label)"
        @change="$emit('validate', currentValue)"
      >
        <template v-slot:prepend>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
            </template>
            {{ locale(meta.hint) || locale(meta.label) }}
          </v-tooltip>
        </template>
      </CarbisSwitch>
    </v-sheet>
    <v-sheet v-else>
      <v-alert color="warning">
        <span style="color: white">Необходимо переопределить поле</span>
      </v-alert>
    </v-sheet>
  </v-sheet>
</template>

<script>
import InputField from "../../ui/Carbis/InputField.vue";
import PasswordField from "../../ui/Carbis/PasswordField.vue";
import CarbisSwitch from "../../ui/Carbis/CarbisSwitch.vue";
export default {
  components: { InputField, PasswordField, CarbisSwitch },
  props: ["value", "meta", "locale"],
  data() {
    return {
      typeMap: {
        str: "text",
        int: "number",
        float: "number",
        bool: "bool",
      },
      currentValue: this.value,
    };
  },
  computed: {
    currentRule() {
      return this.meta.rule
        ? this.meta.rule.includes("InRange")
          ? this.createRangeRule(this.meta.rule)
          : []
        : [];
    },
  },
  methods: {
    getRange(rule) {
      const range = [];
      rule.split(",").forEach((element) => {
        const rangeValue = element.split("").filter((el) => this.isDigit(el));
        range.push(parseInt(rangeValue.join("")));
      });
      return range;
    },
    createRangeRule(rule) {
      const range = this.getRange(rule);
      return [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) =>
          (v <= range[1] && v >= range[0]) ||
          `Значение должно быть в пределах (${range[0]}, ${range[1]})`,
      ];
    },
    isDigit(element) {
      return /\d+/.test(element);
    },
  },
  watch: {
    currentValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style>
</style>