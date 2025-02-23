<template>
    <div class="dashboard-container">
      <h1>Automation Module Analytics</h1>
      
      <!-- Add Module Selector -->
      <div class="module-selector">
        <button 
          v-for="module in ['Press', 'Turning']" 
          :key="module"
          :class="['module-btn', { active: selectedModule === module }]"
          @click="selectModule(module)"
        >
          {{ module }}
        </button>
      </div>
  
      <!-- Update the OEE dashboard section -->
      <div class="oee-dashboard">
        <div class="oee-header">
          <h2>Overall Equipment Effectiveness (OEE)</h2>
        </div>
        <div class="oee-grid">
          <div class="oee-metric">
            <h3>Availability</h3>
            <div class="oee-value" :class="getOEEClass(oeeMetrics.availability)">
              {{ oeeMetrics.availability.toFixed(1) }}%
            </div>
            <p class="oee-description">Machine Uptime vs Total Time</p>
            <div class="baseline-indicator">
              Baseline: {{ baselineOEEMetrics.availability }}%
            </div>
          </div>
          <div class="oee-metric">
            <h3>Performance</h3>
            <div class="oee-value" :class="getOEEClass(oeeMetrics.performance)">
              {{ oeeMetrics.performance.toFixed(1) }}%
            </div>
            <p class="oee-description">Actual vs Ideal Production Rate</p>
            <div class="baseline-indicator">
              Baseline: {{ baselineOEEMetrics.performance }}%
            </div>
          </div>
          <div class="oee-metric">
            <h3>Quality</h3>
            <div class="oee-value" :class="getOEEClass(oeeMetrics.quality)">
              {{ oeeMetrics.quality.toFixed(1) }}%
            </div>
            <p class="oee-description">Good Parts vs Total Parts</p>
            <div class="baseline-indicator">
              Baseline: {{ baselineOEEMetrics.quality }}%
            </div>
          </div>
          <div class="oee-metric total">
            <h3>Overall OEE</h3>
            <div class="oee-value" :class="getOEEClass(oeeMetrics.oee)">
              {{ oeeMetrics.oee.toFixed(1) }}%
            </div>
            <p class="oee-description">World Class OEE > 85%</p>
            <div class="baseline-indicator">
              Baseline: {{ baselineOEEMetrics.oee.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add after the OEE Dashboard section -->
      <OEEValidation 
        :currentMetrics="oeeMetrics"
        class="validation-section"
      />
  
      <!-- Module Status Section -->
      <div class="module-section">
        <h2>{{ selectedModule }} Module</h2>
        
        <!-- Current Step & Error Message -->
        <div class="status-panel" v-if="currentStatus">
          <div class="current-step">
            <h3>Current Step</h3>
            <p>{{ currentStatus['Current Step'] || 'N/A' }}</p>
          </div>
          <div class="error-message" v-if="currentStatus['Error Message']">
            <h3>Error Message</h3>
            <p>{{ currentStatus['Error Message'] }}</p>
          </div>
        </div>
  
        <!-- ... existing status indicators ... -->
      </div>
  
      <div class="chart-grid">
        <!-- Machine Status Section -->
        <div class="chart-container machine-status">
          <h2>Machine Status</h2>
          <div class="chart-wrapper">
            <div class="status-indicators" v-if="machineStatusData">
              <div class="status-item" :class="{ active: machineStatusData.Active }">
                <span class="status-label">Active</span>
                <span class="status-value">{{ machineStatusData.Active ? 'Yes' : 'No' }}</span>
              </div>
              <div class="status-item" :class="{ error: machineStatusData.Error }">
                <span class="status-label">Error</span>
                <span class="status-value">{{ machineStatusData.Error ? 'Yes' : 'No' }}</span>
              </div>
              <div class="status-item" :class="{ ready: machineStatusData.Ready }">
                <span class="status-label">Ready</span>
                <span class="status-value">{{ machineStatusData.Ready ? 'Yes' : 'No' }}</span>
              </div>
              <div class="status-item" :class="{ running: machineStatusData.Start }">
                <span class="status-label">Start</span>
                <span class="status-value">{{ machineStatusData.Start ? 'Yes' : 'No' }}</span>
              </div>
            </div>
            <Line v-if="machineStatusHistory" 
                  :data="machineStatusHistory" 
                  :options="machineStatusOptions" />
          </div>
        </div>
  
        <!-- RFID Tracking Section -->
        <div class="chart-container">
          <h2>RFID Carrier Tracking</h2>
          <div class="rfid-grid" v-if="rfidData">
            <div v-for="carrier in rfidCarriers" :key="carrier" class="rfid-card">
              <h3>Carrier {{ carrier }}</h3>
              <p>Last Code: {{ getLastCarrierCode(carrier) }}</p>
              <p>Last Seen: {{ getLastCarrierTime(carrier) }}</p>
            </div>
          </div>
          <Line v-if="rfidChartData" 
                :data="rfidChartData" 
                :options="rfidOptions" />
        </div>
  
        <!-- Update the Temperature & Humidity chart container -->
        <div class="chart-container temperature-humidity">
          <h2>Temperature & Humidity</h2>
          <div class="chart-wrapper">
            <Line v-if="environmentData" 
                  :data="environmentData" 
                  :options="environmentOptions" />
          </div>
        </div>
        
        <div class="chart-container">
          <h2>Compressed Air</h2>
          <Line v-if="compressedAirData" 
                :data="compressedAirData" 
                :options="compressedAirOptions" />
        </div>
  
        <div class="chart-container">
          <h2>Acceleration Data</h2>
          <Line v-if="accelerationData" 
                :data="accelerationData" 
                :options="motionOptions" />
        </div>
  
        <div class="chart-container">
          <h2>Gyroscope Data</h2>
          <Line v-if="gyroscopeData" 
                :data="gyroscopeData" 
                :options="motionOptions" />
        </div>
  
      
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import { Line } from 'vue-chartjs';
  import OEEValidation from '../components/OEEValidation.vue';
  import BaselineOEEInput from '../components/BaselineOEEInput.vue';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export default {
    name: 'ErrorLogs',
    components: { 
      Line,
      OEEValidation,
      BaselineOEEInput
    },
    setup() {
      const environmentData = ref(null);
      const compressedAirData = ref(null);
      const accelerationData = ref(null);
      const gyroscopeData = ref(null);
      const machineStatusData = ref(null);
      const machineStatusHistory = ref(null);
      const rfidData = ref(null);
      const rfidChartData = ref(null);
      const rfidCarriers = ref([]);
      const lightData = ref(null);
      const magneticData = ref(null);
      const selectedModule = ref('Press');
      const currentStatus = ref(null);
      const oeeMetrics = ref({
        availability: 0,
        performance: 0,
        quality: 0,
        oee: 0
      });
      const baselineOEEMetrics = ref({
        availability: 65,
        performance: 70,
        quality: 75,
        oee: 34.13
      });
      let pollInterval = null;
  
      const OEE_CONFIG = {
        idealCycleTime: 60, // seconds
        plannedProductionTime: 8 * 60 * 60, // 8 hours in seconds
        targetParts: 100 // target parts per shift
      };
  
      const calculateOEE = (statusData, airData) => {
        if (!statusData?.length) {
          console.warn('No status data available for OEE calculation');
          return;
        }
      
        try {
          console.log('Calculating OEE with:', {
            statusDataPoints: statusData.length,
            airDataPoints: airData?.length || 0
          });
      
          // Calculate Availability
          const totalTime = statusData.length;
          const runningTime = statusData.filter(d => d.Active).length;
          const availability = (runningTime / totalTime) * 100;
      
          // Calculate Performance using compressed air data
          let performance = 0;
          if (airData?.length) {
            const idealCycleTime = 60; // seconds
            const actualProductionTime = airData.reduce((acc, curr, idx, arr) => {
              if (idx === 0) return 0;
              const timeDiff = (new Date(curr.time) - new Date(arr[idx-1].time)) / 1000;
              return acc + timeDiff;
            }, 0);
      
            const targetOutput = actualProductionTime / idealCycleTime;
            const actualOutput = airData.length;
            performance = (actualOutput / targetOutput) * 100;
          }
      
          // Calculate Quality
          const totalParts = statusData.filter(d => d.Active).length;
          const defectiveParts = statusData.filter(d => d.Error).length;
          const goodParts = totalParts - defectiveParts;
          const quality = totalParts > 0 ? (goodParts / totalParts) * 100 : 0;
      
          // Calculate Overall OEE
          const oee = (availability * performance * quality) / 10000;
      
          // Update OEE metrics with validation
          oeeMetrics.value = {
            availability: Math.min(Math.max(availability, 0), 100),
            performance: Math.min(Math.max(performance, 0), 100),
            quality: Math.min(Math.max(quality, 0), 100),
            oee: Math.min(Math.max(oee, 0), 100)
          };
      
          console.log('OEE Metrics Updated:', {
            availability: oeeMetrics.value.availability.toFixed(1) + '%',
            performance: oeeMetrics.value.performance.toFixed(1) + '%',
            quality: oeeMetrics.value.quality.toFixed(1) + '%',
            oee: oeeMetrics.value.oee.toFixed(1) + '%'
          });
      
        } catch (error) {
          console.error('Error calculating OEE:', error);
        }
      };
  
      const getOEEClass = (value) => {
        if (value >= 85) return 'excellent';
        if (value >= 60) return 'good';
        if (value >= 40) return 'fair';
        return 'poor';
      };
  
      const fetchData = async () => {
        try {
          console.log('Fetching sensor data...');
          
          // Add magnetic data to the fetch requests
          const [
            moduleStatusResponse, 
            moduleAirResponse, 
            moduleAllDataResponse,
            xdkResponse,
            motionResponse,
            rfidResponse,
            lightResponse,
            magneticResponse
          ] = await Promise.all([
            fetch(`http://localhost:5000/api/modules/${selectedModule.value}/status`),
            fetch(`http://localhost:5000/api/modules/${selectedModule.value}/compressed-air`),
            fetch(`http://localhost:5000/api/modules/${selectedModule.value}/all-data`),
            fetch('http://localhost:5000/api/xdk-sensors'),
            fetch('http://localhost:5000/api/motion-data'),
            fetch('http://localhost:5000/api/rfid-tracking'),
            fetch('http://localhost:5000/api/xdk-sensors/light'),
            fetch('http://localhost:5000/api/magnetic-data')
          ]);
      
          const [
            statusData, 
            airData, 
            allData,
            xdkData,
            motionData,
            rfidResult,
            lightData,
            magneticResult
          ] = await Promise.all([
            moduleStatusResponse.json(),
            moduleAirResponse.json(),
            moduleAllDataResponse.json(),
            xdkResponse.json(),
            motionResponse.json(),
            rfidResponse.json(),
            lightResponse.json(),
            magneticResponse.json()
          ]);
      
          // Process XDK sensor data
          if (xdkData?.length) {
            // Environment data
            environmentData.value = {
              labels: xdkData.map(d => new Date(d.time).toLocaleTimeString()),
              datasets: [
                {
                  label: 'Temperature (°C)',
                  data: xdkData.map(d => d.TEMP),
                  borderColor: '#ff6384',
                  fill: false
                },
                {
                  label: 'Humidity (%)',
                  data: xdkData.map(d => d.HUMIDITY),
                  borderColor: '#36a2eb',
                  fill: false
                }
              ]
            };
      
            // Light data
            if (lightData?.length) {
              // Group data by device
              const devices = [...new Set(lightData.map(d => d.device))];
              const processedLightData = {
                labels: [...new Set(lightData.map(d => new Date(d.time).toLocaleTimeString()))],
                datasets: devices.map(device => ({
                  label: `Light Intensity - ${device}`,
                  data: lightData
                    .filter(d => d.device === device)
                    .map(d => d.LIGHT),
                  borderColor: device === 'XDK1' ? '#ffcd56' : '#36a2eb',
                  fill: false
                }))
              };
              console.log('Processed light data:', {
                devices,
                dataPoints: processedLightData.datasets.map(d => d.data.length)
              });
              lightData.value = processedLightData;
            }
          }
      
          // Process motion data
          if (motionData?.acceleration?.length) {
            accelerationData.value = {
              labels: motionData.acceleration.map(d => new Date(d.time).toLocaleTimeString()),
              datasets: [
                {
                  label: 'X-axis',
                  data: motionData.acceleration.map(d => d.x),
                  borderColor: '#ff6384',
                  fill: false
                },
                {
                  label: 'Y-axis',
                  data: motionData.acceleration.map(d => d.y),
                  borderColor: '#36a2eb',
                  fill: false
                },
                {
                  label: 'Z-axis',
                  data: motionData.acceleration.map(d => d.z),
                  borderColor: '#4bc0c0',
                  fill: false
                }
              ]
            };
          }
      
          if (motionData?.gyroscope?.length) {
            gyroscopeData.value = {
              labels: motionData.gyroscope.map(d => new Date(d.time).toLocaleTimeString()),
              datasets: [
                {
                  label: 'X-axis',
                  data: motionData.gyroscope.map(d => d.x),
                  borderColor: '#ff6384',
                  fill: false
                },
                {
                  label: 'Y-axis',
                  data: motionData.gyroscope.map(d => d.y),
                  borderColor: '#36a2eb',
                  fill: false
                },
                {
                  label: 'Z-axis',
                  data: motionData.gyroscope.map(d => d.z),
                  borderColor: '#4bc0c0',
                  fill: false
                }
              ]
            };
          }
      
          // Process RFID data
          if (rfidResult?.length) {
            const carriers = [...new Set(rfidResult.map(d => d.CarrierID))];
            rfidCarriers.value = carriers;
            rfidData.value = rfidResult;
          }
      
          // Process existing machine status and compressed air data
          if (statusData?.length) {
            // Update current machine status
            machineStatusData.value = statusData[statusData.length - 1];
          
            // Update machine status history
            machineStatusHistory.value = {
              labels: statusData.map(d => new Date(d.time).toLocaleTimeString()),
              datasets: [
                {
                  label: 'Active',
                  data: statusData.map(d => d.Active ? 1 : 0),
                  borderColor: '#42b883',
                  stepped: true,
                  fill: false
                },
                {
                  label: 'Ready',
                  data: statusData.map(d => d.Ready ? 1 : 0),
                  borderColor: '#36a2eb',
                  stepped: true,
                  fill: false
                },
                {
                  label: 'Error',
                  data: statusData.map(d => d.Error ? 1 : 0),
                  borderColor: '#ff6384',
                  stepped: true,
                  fill: false
                }
              ]
            };
          }
          
          // Process compressed air data
          if (airData?.length) {
            compressedAirData.value = {
              labels: airData.map(d => new Date(d.time).toLocaleTimeString()),
              datasets: [
                {
                  label: 'Pressure (hPa)',
                  data: airData.map(d => d.Pressure),
                  borderColor: '#4bc0c0',
                  fill: false
                },
                {
                  label: 'Flow',
                  data: airData.map(d => d.Flow),
                  borderColor: '#ffcd56',
                  fill: false
                }
              ]
            };
          }
          
          // Process magnetic sensor data
          if (magneticResult?.length) {
            // Group data by device
            const devices = [...new Set(magneticResult.map(d => d.device))];
            const processedMagneticData = {
              labels: [...new Set(magneticResult.map(d => new Date(d.time).toLocaleTimeString()))],
              datasets: devices.flatMap(device => [
                {
                  label: `X-axis - ${device}`,
                  data: magneticResult
                    .filter(d => d.device === device)
                    .map(d => d.x),
                  borderColor: device === 'XDK1' ? '#ff6384' : '#ff9f40',
                  fill: false
                },
                {
                  label: `Y-axis - ${device}`,
                  data: magneticResult
                    .filter(d => d.device === device)
                    .map(d => d.y),
                  borderColor: device === 'XDK1' ? '#36a2eb' : '#4bc0c0',
                  fill: false
                },
                {
                  label: `Z-axis - ${device}`,
                  data: magneticResult
                    .filter(d => d.device === device)
                    .map(d => d.z),
                  borderColor: device === 'XDK1' ? '#4bc0c0' : '#9966ff',
                  fill: false
                }
              ])
            };
            console.log('Processed magnetic data:', {
              devices,
              dataPoints: processedMagneticData.datasets.map(d => d.data.length)
            });
            magneticData.value = processedMagneticData;
          }
          
          // Add debug logging
          console.log('Data processed:', {
            machineStatus: machineStatusHistory.value?.datasets?.[0]?.data?.length || 0,
            compressedAir: compressedAirData.value?.datasets?.[0]?.data?.length || 0
          });
  
          // Add after the data fetching section in fetchData
          console.log('Raw data received:', {
            light: {
              count: lightData?.length || 0,
              sample: lightData?.[0]
            },
            magnetic: {
              count: magneticResult?.length || 0,
              sample: magneticResult?.[0]
            }
          });
  
          // After fetching data, explicitly calculate OEE
          if (statusData?.length && airData?.length) {
            calculateOEE(statusData, airData);
          } else {
            console.warn('Missing data for OEE calculation:', {
              hasStatusData: Boolean(statusData?.length),
              hasAirData: Boolean(airData?.length)
            });
          }
      
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      const getLastCarrierCode = (carrierId) => {
        if (!rfidData.value) return 'N/A';
        const lastRecord = [...rfidData.value]
          .reverse()
          .find(d => d.CarrierID === carrierId);
        return lastRecord ? lastRecord.Code : 'N/A';
      };
  
      const getLastCarrierTime = (carrierId) => {
        if (!rfidData.value) return 'N/A';
        const lastRecord = [...rfidData.value]
          .reverse()
          .find(d => d.CarrierID === carrierId);
        return lastRecord ? new Date(lastRecord.time).toLocaleTimeString() : 'N/A';
      };
  
      const selectModule = (module) => {
        selectedModule.value = module;
        // Fetch current status for the selected module
        fetchCurrentStatus(module);
      };
  
      const fetchCurrentStatus = async (module) => {
        try {
          const response = await fetch(`http://localhost:5000/api/${module.toLowerCase()}-status`);
          const data = await response.json();
          currentStatus.value = data;
        } catch (error) {
          console.error('Error fetching current status:', error);
        }
      };
  
      const updateBaselineOEE = (newBaseline) => {
        baselineOEEMetrics.value = newBaseline;
        // Recalculate OEE metrics if needed
      };
  
      onMounted(async () => {
        try {
          // Check backend health
          const healthResponse = await fetch('http://localhost:5000/health');
          const healthData = await healthResponse.json();
          console.log('Backend health status:', healthData);
  
          if (healthData.status === 'ok') {
            fetchData();
            pollInterval = setInterval(fetchData, 5000);
          } else {
            console.error('Backend health check failed');
          }
        } catch (error) {
          console.error('Error checking backend health:', error);
        }
      });
  
      onUnmounted(() => {
        if (pollInterval) clearInterval(pollInterval);
      });
  
      return {
        environmentData,
        compressedAirData,
        accelerationData,
        gyroscopeData,
        machineStatusData,
        machineStatusHistory,
        rfidData,
        rfidChartData,
        rfidCarriers,
        getLastCarrierCode,
        getLastCarrierTime,
        selectedModule,
        currentStatus,
        selectModule,
        environmentOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                padding: 10
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              grid: {
                color: '#f0f0f0'
              },
              ticks: {
                padding: 10
              }
            }
          }
        },
        compressedAirOptions: {
          responsive: true,
          maintainAspectRatio: false
        },
        motionOptions: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true
              }
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              title: {
                display: true,
                text: 'Magnetic Field (μT)'
              }
            }
          }
        },
        machineStatusOptions: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true
              }
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
                minRotation: 45,
                padding: 10
              }
            },
            y: {
              display: true,
              min: -0.1, // Add some padding below
              max: 1.1,  // Add some padding above
              grid: {
                color: '#f0f0f0'
              },
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  if (value === 0) return 'Off';
                  if (value === 1) return 'On';
                  return '';
                }
              }
            }
          }
        },
        rfidOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        },
        sensorOptions: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true
              }
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              title: {
                display: true,
                text: 'Light Intensity (lux)'
              }
            }
          }
        },
        oeeMetrics,
        getOEEClass,
        lightOptions: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true
              }
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              title: {
                display: true,
                text: 'Light Intensity (lux)'
              }
            }
          }
        },
        magneticOptions: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true
              }
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Magnetic Field (μT)'
              }
            }
          }
        },
        baselineOEEMetrics,
        updateBaselineOEE
      };
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 40px; /* Increased gap between charts */
    margin-top: 30px;
    margin-bottom: 30px; /* Add bottom margin */
  }
  
  .chart-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 450px; /* Base height */
    display: flex;
    flex-direction: column;
  }
  
  /* Add specific heights for Temperature & Humidity and Machine Status */
  .chart-container.machine-status,
  .chart-container:has(h2:contains("Temperature & Humidity")) {
    height: 600px; /* Increased height */
  }
  
  .chart-wrapper {
    flex: 1;
    min-height: 450px; /* Increased minimum height */
    position: relative;
    margin-bottom: 20px; /* Add space for x-axis labels */
  }
  
  .chart-container.machine-status {
    height: 500px;
    margin-bottom: 30px;
  }
  
  .chart-container.machine-status .chart-wrapper {
    height: 400px;
    padding-bottom: 40px; /* Extra space for x-axis labels */
  }
  
  /* Add this if you're using status indicators above the chart */
  .status-indicators {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  h1 {
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  h2 {
    margin-bottom: 15px;
    color: #34495e;
    font-size: 1.2em;
  }
  
  .status-indicators {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .status-item {
    padding: 1rem;
    border-radius: 8px;
    background: #f8f9fa;
    text-align: center;
    border: 1px solid #dee2e6;
  }
  
  .status-item.active { background: #42b883; color: white; }
  .status-item.error { background: #ff6384; color: white; }
  .status-item.ready { background: #36a2eb; color: white; }
  .status-item.running { background: #ffcd56; color: white; }
  
  .status-label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .rfid-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .rfid-card {
    padding: 1rem;
    border-radius: 8px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
  }
  
  .rfid-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }
  
  .rfid-card p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
  
  .module-selector {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .module-btn {
    padding: 0.75rem 2rem;
    border: 2px solid #42b883; /* Add border */
    border-radius: 8px;
    background: #ffffff; /* Light background for inactive */
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    color: #42b883; /* Green text for inactive */
    font-weight: 500;
  }
  
  .module-btn:hover {
    background: #f0f9f6; /* Light green background on hover */
    transform: translateY(-1px);
  }
  
  .module-btn.active {
    background: #42b883;
    color: #ffffff; /* White text for active */
    border-color: #42b883;
    box-shadow: 0 2px 4px rgba(66, 184, 131, 0.2); /* Add shadow for active state */
  }
  
  .module-section {
    margin-bottom: 20px;
  }
  
  .status-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .current-step, .error-message {
    padding: 1rem;
    border-radius: 8px;
    background: #f8f9fa;
  }
  
  .error-message {
    background: #fff5f5;
    border: 1px solid #ff6384;
  }
  
  .oee-dashboard {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .oee-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 15px;
  }
  
  .oee-metric {
    text-align: center;
    padding: 15px;
    border-radius: 8px;
    background: #f8f9fa;
    transition: all 0.3s ease;
  }
  
  .oee-metric:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .oee-metric.total {
    background: #e3f2fd;
  }
  
  .oee-value {
    font-size: 2em;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .oee-description {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
  }
  
  .oee-value.excellent { color: #42b883; }
  .oee-value.good { color: #2196f3; }
  .oee-value.fair { color: #ffa726; }
  .oee-value.poor { color: #ef5350; }
  
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #666;
    font-style: italic;
  }
  
  .validation-section {
    margin: 20px 0;
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }
  
  .baseline-indicator {
    font-size: 0.8em;
    color: #666;
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px dashed #eee;
  }
  
  :deep(.p-button-sm) {
    padding: 0.4rem;
    font-size: 0.875rem;
  }
  
  :deep(.p-button-text) {
    color: #666;
  }
  
  :deep(.p-button-text:hover) {
    background: #f0f0f0;
    color: #333;
  }
  </style>