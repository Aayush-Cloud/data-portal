<template>
    <div class="controls">
      <div class="search-bar">
        <InputText
          v-model="searchQuery"
          placeholder="Search machines..."
          class="p-inputtext-lg w-full"
          @input="emitSearch"
        />
        <Button
          icon="pi pi-search"
          class="p-button-outlined p-button-primary ml-2"
        />
      </div>
      <Button
        label="Filter"
        icon="pi pi-filter"
        class="p-button-outlined p-button-secondary"
        @click="$emit('show-filter')"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchFilter',
    data() {
      return {
        searchQuery: ''
      }
    },
    emits: ['search', 'show-filter'],
    methods: {
      emitSearch() {
        this.$emit('search', this.searchQuery)
      }
    }
  }
  </script>
  
  <style scoped>
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .search-bar {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    margin-right: 1rem;
  }
  </style>