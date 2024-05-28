<template>
  <tr>
    <td v-for="i in props.count ?? 7">
      <free-style-shimmer border-radius="5px" color="#dddddd" :height="props.sHeight ?? '30px'"
        :width="props.sWidth ?? '100%'" />
    </td>
  </tr>
</template>
<script setup>
import { FreeStyleShimmer } from "vue3-shimmer";
const props = defineProps(["count", "sHeight"]);
</script>
<style scoped>
td {
  padding: 4px;
}
</style>
