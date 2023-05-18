<template>
  <v-sheet>
    <slot name="develop"></slot>
    <v-sheet v-if="[typeMap.str, typeMap.int].includes(typeMap[meta.type])">
      <InputField
        v-model="currentValue"
        @change="(v) => $emit('validate', v)"
        :label="meta.label"
        :type="typeMap[meta.type]"
        v-if="!meta.password"
      >
        <template v-slot:prepend>
          <ToolTip :label="meta.label" :hint="meta.hint" />
        </template>
        <template #append-outer>
          <ResetIcon
            @reset="(v) => reset(v)"
            :newValue="currentValue"
            :oldValue="originalValue"
          />
        </template>
      </InputField>
      <PasswordField
        @change="(v) => $emit('validate', v)"
        v-model="currentValue"
        :label="meta.label"
        :type="typeMap[meta.type]"
        v-else
      >
        <template v-slot:prepend>
          <ToolTip :label="meta.label" :hint="meta.hint" />
        </template>

        <template #append-outer>
          <ResetIcon
            @reset="(v) => reset(v)"
            :newValue="currentValue"
            :oldValue="originalValue"
          />
        </template>
      </PasswordField>
    </v-sheet>
    <v-sheet v-else-if="[typeMap.bool].includes(typeMap[meta.type])">
      <v-switch
        inset
        dense
        v-model="currentValue"
        :label="meta.label"
        @change="
          (v) => {
            $emit('input', v);
            $emit('validate', currentValue);
          }
        "
      >
        <template #prepend>
          <ToolTip :label="meta.label" :hint="meta.hint" />
        </template>
        <template #label>
          <div class="align-center">
            <span class="mr-2">{{ meta.label }}</span>
            <ResetIcon :newValue="currentValue" :oldValue="originalValue" />
          </div>
        </template>
      </v-switch>
    </v-sheet>
    <v-sheet v-else>
      <v-alert color="warning">
        <span style="color: white">Необходимо переопределить поле</span>
      </v-alert>
    </v-sheet>
  </v-sheet>
</template>

<script>
import InputField from "./ui/InputField.vue";
import PasswordField from "./ui/PasswordField.vue";
import ResetIcon from "./ui/ResetIcon.vue";
import ToolTip from "./ui/ToolTip.vue";
export default {
  components: { InputField, PasswordField, ResetIcon, ToolTip },
  props: {
    value: {
      type: [Number, String, Boolean],
      required: true,
    },
    meta: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      typeMap: {
        str: "text",
        int: "number",
        float: "number",
        bool: "bool",
      },
      originalValue: this.value,
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
    reset(value) {
      this.currentValue = value;
      this.$emit("validate", value);
    },
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