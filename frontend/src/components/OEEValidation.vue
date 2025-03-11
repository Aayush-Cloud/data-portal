<template>
  <div class="validation-dashboard">
    
    <h2>OEE Validation Results</h2>
    
    <div class="validation-grid">
      <!-- Baseline vs Current -->
      <div class="validation-card">
        <h3>Baseline vs Current Performance</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Baseline</th>
              <th>Current</th>
              <th>Improvement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Availability</td>
              <td>{{ baselineMetrics.availability }}%</td>
              <td>{{ currentMetrics.availability.toFixed(1) }}%</td>
              <td :class="getImprovementClass(improvements.availability)">
                +{{ improvements.availability.toFixed(1) }}%
              </td>
            </tr>
            <tr>
              <td>Performance</td>
              <td>{{ baselineMetrics.performance }}%</td>
              <td>{{ currentMetrics.performance.toFixed(1) }}%</td>
              <td :class="getImprovementClass(improvements.performance)">
                +{{ improvements.performance.toFixed(1) }}%
              </td>
            </tr>
            <tr>
              <td>Quality</td>
              <td>{{ baselineMetrics.quality }}%</td>
              <td>{{ currentMetrics.quality.toFixed(1) }}%</td>
              <td :class="getImprovementClass(improvements.quality)">
                +{{ improvements.quality.toFixed(1) }}%
              </td>
            </tr>
            <tr class="total-row">
              <td>Overall OEE</td>
              <td>{{ baselineMetrics.oee }}%</td>
              <td>{{ currentMetrics.oee.toFixed(1) }}%</td>
              <td :class="getImprovementClass(improvements.oee)">
                +{{ improvements.oee.toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Financial Impact -->
      <div class="validation-card">
        <div class="card-header">
          <h3>Business Impact Analysis</h3>
          <div class="header-actions">
            <BaselineOEEInput
              class="baseline-input"
              :currentBaseline="baselineMetrics"
              @update:baseline="updateBaseline"
            />
            <Button 
              icon="pi pi-euro"
              class="p-button-text p-button-rounded"
              @click="showROIConfig = true"
              tooltip="Configure ROI Parameters"
            />
          </div>
        </div>
        <div class="metrics-grid">
          <div class="metric">
            <h4>Production Change</h4>
            <div class="value" :class="{ negative: businessImpact.trend.isPositive === false }">
              {{ businessImpact.productionIncrease }}%
            </div>
            <div class="description">vs Baseline</div>
          </div>
          <div class="metric">
            <h4>Financial Impact</h4>
            <div class="value" :class="{ negative: businessImpact.trend.isPositive === false }">
              {{ businessImpact.trend.isPositive ? '+' : '-' }}€{{ businessImpact.costSavings }}
            </div>
            <div class="description">Annual Impact</div>
          </div>
          <div class="metric">
            <h4>ROI</h4>
            <div class="value" :class="{ negative: businessImpact.trend.isPositive === false }">
              {{ businessImpact.roi }}%
            </div>
            <div class="description">
              Return on €{{ roiParams.implementationCost.toLocaleString('de-DE') }} Investment
            </div>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="showROIConfig" header="Configure ROI Parameters" modal>
        <div class="roi-config-form">
          <div class="input-group">
            <label>Hourly Operating Cost</label>
            <div class="currency-input">
              <span class="currency-symbol">€</span>
              <InputNumber 
                v-model="roiParams.hourlyRate" 
                :min="0" 
                :minFractionDigits="2" 
                :maxFractionDigits="2"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div class="input-group">
            <label>Working Hours per Day</label>
            <InputNumber 
              v-model="roiParams.workingHours" 
              :min="0" 
              :max="24"
              showButtons
              :step="1"
            />
          </div>
          <div class="input-group">
            <label>Working Days per Year</label>
            <InputNumber 
              v-model="roiParams.workingDays" 
              :min="0" 
              :max="365"
              showButtons
              :step="1"
            />
          </div>
          <div class="input-group">
            <label>Implementation Cost</label>
            <div class="currency-input">
              <span class="currency-symbol">€</span>
              <InputNumber 
                v-model="roiParams.implementationCost" 
                :min="0"
                :minFractionDigits="2" 
                :maxFractionDigits="2"
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="showROIConfig = false" class="p-button-text" />
          <Button label="Save" icon="pi pi-check" @click="saveROIConfig" autofocus />
        </template>
      </Dialog>
    
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import BaselineOEEInput from './BaselineOEEInput.vue';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

export default {
  name: 'OEEValidation',
  components: {
    BaselineOEEInput,
    Dialog,
    InputNumber,
    Button
  },
  props: {
    currentMetrics: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const baselineMetrics = ref({
      availability: 65,
      performance: 70,
      quality: 75,
      oee: 34.13 // 65 * 70 * 75 / 10000
    });

    const updateBaseline = (newBaseline) => {
      baselineMetrics.value = newBaseline;
      // Recalculate improvements with new baseline
    };

    // Calculate improvements
    const improvements = computed(() => ({
      availability: ((props.currentMetrics.availability - baselineMetrics.value.availability) / 
                    baselineMetrics.value.availability) * 100,
      performance: ((props.currentMetrics.performance - baselineMetrics.value.performance) / 
                   baselineMetrics.value.performance) * 100,
      quality: ((props.currentMetrics.quality - baselineMetrics.value.quality) / 
                baselineMetrics.value.quality) * 100,
      oee: ((props.currentMetrics.oee - baselineMetrics.value.oee) / 
            baselineMetrics.value.oee) * 100
    }));

    // Update the computed property for productionIncrease
    const productionIncrease = computed(() => {
      const increase = ((props.currentMetrics.oee - baselineMetrics.value.oee) / baselineMetrics.value.oee) * 100;
      return Math.min(increase, 999.99).toFixed(1); // Cap at 999.99% and format to 1 decimal place
    });

    const costSavings = computed(() => {
      const hourlyRate = 500; // €/hour
      const annualHours = 8760; // 24/7 operation
      return Math.round((props.currentMetrics.oee - baselineMetrics.value.oee) / 100 * 
             hourlyRate * annualHours);
    });

    const roi = computed(() => {
      const implementationCost = 50000; // Example cost
      return Math.round((costSavings.value / implementationCost) * 100);
    });

    const getImprovementClass = (value) => {
      if (value >= 20) return 'significant-improvement';
      if (value >= 10) return 'good-improvement';
      if (value > 0) return 'moderate-improvement';
      return 'no-improvement';
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            color: '#f0f0f0'
          }
        }
      }
    };

    const calculateBusinessImpact = (currentMetrics, baselineMetrics) => {
      try {
        // Production Change calculation
        const productionChange = ((currentMetrics.oee - baselineMetrics.oee) / baselineMetrics.oee) * 100;
    
        // Cost Impact using dynamic parameters
        const annualOperatingTime = roiParams.value.workingHours * roiParams.value.workingDays;
        const oeeDifference = currentMetrics.oee - baselineMetrics.oee;
        const costImpact = (oeeDifference / 100) * roiParams.value.hourlyRate * annualOperatingTime;
    
        // ROI using dynamic implementation cost
        const roi = (costImpact / roiParams.value.implementationCost) * 100;
    
        return {
          productionIncrease: productionChange.toFixed(1),
          costSavings: costImpact.toLocaleString('de-DE'),
          roi: roi.toFixed(1),
          trend: {
            isPositive: oeeDifference >= 0,
            difference: Math.abs(oeeDifference).toFixed(1)
          }
        };
      } catch (error) {
        console.error('Error calculating business impact:', error);
        return {
          productionIncrease: '0.0',
          costSavings: '0',
          roi: '0.0',
          trend: { isPositive: false, difference: '0.0' }
        };
      }
    };

    const saveROIConfig = () => {
      showROIConfig.value = false;
      // ROI will automatically recalculate due to reactivity
    };

    const businessImpact = computed(() => calculateBusinessImpact(props.currentMetrics, baselineMetrics.value));

    const showROIConfig = ref(false);
    const roiParams = ref({
      hourlyRate: 150,
      workingHours: 8,
      workingDays: 250,
      implementationCost: 50000
    });

    return {
      baselineMetrics,
      improvements,
      productionIncrease,
      costSavings,
      roi,
      getImprovementClass,
      chartOptions,
      updateBaseline,
      businessImpact,
      showROIConfig,
      roiParams,
      saveROIConfig
    };
  }
};
</script>

<style scoped>
.validation-dashboard {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.validation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.validation-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  min-height: 400px; /* Add minimum height */
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.baseline-input{
    display: inline-block;
}
.comparison-table th,
.comparison-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.comparison-table th {
  background: #f1f3f5;
  font-weight: 600;
}

.total-row {
  font-weight: 600;
  background: #e3f2fd;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
  height: 300px; /* Fixed height for consistent graphs */
}

.metric {
  background: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.metric h4 {
  margin: 0 0 10px 0;
  color: #555;
}

.value {
  font-size: 1.5em;
  font-weight: bold;
  color: #2196f3;
}

.value.negative {
  color: #ef5350;
}

.description {
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
}

.significant-improvement { color: #42b883; }
.good-improvement { color: #2196f3; }
.moderate-improvement { color: #ffa726; }
.no-improvement { color: #ef5350; }

/* Add new styles for chart containers */
.chart-container {
  position: relative;
  height: 300px;
  margin: 20px 0;
  padding-bottom: 30px; /* Add padding for x-axis labels */
}

/* Add these new styles */
.roi-config-form {
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
  min-width: 200px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Update existing card-header style */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Add to your existing styles */
.currency-input {
  position: relative;
  display: inline-block;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  color: #666;
  pointer-events: none;
}

:deep(.p-inputnumber .p-inputtext) {
  padding-left: 25px;
  width: 200px;
}

:deep(.p-inputnumber-button) {
  color: #666;
}
</style>