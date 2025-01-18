// src/components/SearchFilter.vue
<template>
  <div class="controls">
    <div class="search-bar">
      <InputText
        :value="searchTerm"
        @input="$emit('update:searchTerm', $event.target.value)"
        placeholder="Search..."
        class="p-inputtext-lg w-full"
      />
      <Button
        icon="pi pi-search"
        class="p-button-outlined p-button-primary"
      />
    </div>

    <div class="filter-section">
      <Button
        label="Filter"
        icon="pi pi-filter"
        class="p-button-outlined p-button-secondary"
        @click="$emit('showFilter')"
      />
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  name: 'SearchFilter',
  components: { InputText, Button },
  props: {
    searchTerm: {
      type: String,
      required: true
    }
  },
  emits: ['update:searchTerm', 'showFilter']
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 1rem;
  flex: 1;
  margin-right: 1rem;
}
</style>