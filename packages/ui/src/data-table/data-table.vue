<template>
  <div>{{ name }}</div>
</template>

<script lang="ts" setup>
import { string } from 'vue-types';

defineProps({
  name: string().isRequired,
});
</script>
