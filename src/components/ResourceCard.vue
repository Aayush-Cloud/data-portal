<template>
    <div class="resource-card">
      <div class="resource-details">
        <h3>{{ resource.name }}</h3>
        <p>{{ resource.description }}</p>
        <Tag :severity="resource.healthStatus">
          {{ resource.healthStatus }}
        </Tag>
      </div>
      <div class="resource-actions">
        <Button
          icon="pi pi-info-circle"
          class="p-button-rounded p-button-info"
          @click="$emit('show-details', resource)"
        />
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-warning"
          @click="$emit('edit', resource)"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger"
          @click="$emit('delete', resource)"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ResourceCard',
    props: {
      resource: {
        type: Object,
        required: true
      }
    },
    emits: ['show-details', 'edit', 'delete']
  }
  </script>
  
  <style scoped>
  .resource-card {
    background: var(--surface-color);
    color: var(--text-color);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 6px var(--border-color);
  }
  
  .resource-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
  }
  </style>