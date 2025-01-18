// src/components/ResourceCard.vue
<template>
  <div class="resource-card">
    <div class="resource-details">
      <h3>{{ resource.name }}</h3>
      <p>{{ resource.description }}</p>
    </div>
    <div class="resource-actions">
      <Button
        icon="pi pi-info-circle"
        class="p-button-rounded p-button-info"
        @click="$emit('view', resource)"
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
import Button from 'primevue/button';

export default {
  name: 'ResourceCard',
  components: { Button },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete']
};
</script>

<style scoped>
.resource-card {
  background: var(--surface-color);
  color: var(--text-color);
  box-shadow: 0px 2px 6px var(--border-color);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.resource-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
</style>