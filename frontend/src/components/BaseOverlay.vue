<template>
  <Transition name="fade">
    <div v-if="show" class="overlay">
      <div class="overlay-content">
        <i class="pi pi-times close-icon" @click="$emit('close')"></i>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'BaseOverlay',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.overlay-content {
  background: var(--surface-color);
  color: var(--text-color);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: var(--text-color);
}
</style>