// src/components/ModalOverlay.vue
<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <i class="pi pi-times close-icon" @click="$emit('close')"></i>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ModalOverlay',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close']
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* Dark overlay background for better contrast */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-color, #222); /* Fallback dark surface */
  color: var(--text-color, #fff);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif; /* Ensure a readable font */
}

.close-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: var(--text-color, #fff);
  font-size: 1.5rem; /* Larger for better accessibility */
  transition: color 0.3s;
}
.close-icon:hover,
.close-icon:focus {
  color: var(--primary-color, #007BFF);
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem; /* Adjust label font size */
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 8px;
  background: var(--input-bg, #333); /* Input background */
  color: var(--text-color, #fff);
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  border-color: var(--primary-color, #007BFF);
  box-shadow: 0 0 5px var(--primary-color, #007BFF);
  outline: none;
}

button {
  display: inline-block;
  background: var(--primary-color, #28a745);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background: var(--primary-hover-color, #218838);
}

button:focus {
  outline: 2px solid var(--primary-color, #007BFF);
  outline-offset: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive design */
@media (max-width: 600px) {
  .modal-content {
    padding: 1.5rem;
  }

  input {
    font-size: 0.9rem;
  }

  button {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }

  .close-icon {
    font-size: 1.2rem;
  }
}

</style>