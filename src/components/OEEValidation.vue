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
          <BaselineOEEInput
            class="baseline-input"
            :currentBaseline="baselineMetrics"
            @update:baseline="updateBaseline"
          />
        </div>
        <div class="metrics-grid">
          <div class="metric">
            <h4>Production Increase</h4>
            <div class="value">{{ productionIncrease }}%</div>
          </div>
          <div class="metric">
            <h4>Cost Savings</h4>
            <div class="value">€{{ costSavings.toLocaleString() }}</div>
          </div>
          <div class="metric">
            <h4>ROI</h4>
            <div class="value">{{ roi }}%</div>
          </div>
        </div>
      </div>

    
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import BaselineOEEInput from './BaselineOEEInput.vue';

export default {
  name: 'OEEValidation',
  components: {
    BaselineOEEInput
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

    return {
      baselineMetrics,
      improvements,
      productionIncrease,
      costSavings,
      roi,
      getImprovementClass,
      chartOptions,
      updateBaseline
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
}
</style>