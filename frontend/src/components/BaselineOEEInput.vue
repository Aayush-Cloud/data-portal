<template>
  <div class="baseline-settings">
    <Button 
      icon="pi pi-cog" 
      class="p-button-rounded p-button-text" 
      @click="showDialog = true"
      tooltip="Configure Baseline OEE"
    />
    
    <Dialog 
      v-model:visible="showDialog" 
      header="Configure Baseline OEE" 
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="baseline-form">
        <div class="input-group">
          <label>Availability (%)</label>
          <InputNumber 
            v-model="tempBaseline.availability" 
            :min="0" 
            :max="100" 
            :step="0.1"
          />
        </div>
        <div class="input-group">
          <label>Performance (%)</label>
          <InputNumber 
            v-model="tempBaseline.performance" 
            :min="0" 
            :max="100" 
            :step="0.1"
          />
        </div>
        <div class="input-group">
          <label>Quality (%)</label>
          <InputNumber 
            v-model="tempBaseline.quality" 
            :min="0" 
            :max="100" 
            :step="0.1"
          />
        </div>
        <div class="calculated-oee">
          Calculated OEE: {{ calculatedOEE.toFixed(1) }}%
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          @click="showDialog = false" 
          class="p-button-text"
        />
        <Button 
          label="Save" 
          icon="pi pi-check" 
          @click="saveBaseline" 
          :disabled="!isValid"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';

export default {
  name: 'BaselineOEEInput',
  components: {
    Button,
    Dialog,
    InputNumber
  },
  props: {
    currentBaseline: {
      type: Object,
      required: true
    }
  },
  emits: ['update:baseline'],
  setup(props, { emit }) {
    const showDialog = ref(false);
    const tempBaseline = ref({
      availability: props.currentBaseline.availability,
      performance: props.currentBaseline.performance,
      quality: props.currentBaseline.quality
    });

    const calculatedOEE = computed(() => {
      const { availability, performance, quality } = tempBaseline.value;
      return (availability * performance * quality) / 10000;
    });

    const isValid = computed(() => {
      const { availability, performance, quality } = tempBaseline.value;
      return (
        availability >= 0 && availability <= 100 &&
        performance >= 0 && performance <= 100 &&
        quality >= 0 && quality <= 100
      );
    });

    const saveBaseline = () => {
      emit('update:baseline', {
        ...tempBaseline.value,
        oee: calculatedOEE.value
      });
      showDialog.value = false;
    };

    return {
      showDialog,
      tempBaseline,
      calculatedOEE,
      isValid,
      saveBaseline
    };
  }
};
</script>

<style scoped>


.baseline-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.input-group label {
  font-weight: 500;
  min-width: 120px;
}

.calculated-oee {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  color: rgb(0, 0, 0);
}
</style>