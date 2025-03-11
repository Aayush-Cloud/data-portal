export interface ValidationResults {
  timeframe: {
    start: Date;
    end: Date;
    durationDays: number;
  };
  improvements: {
    availability: number;
    performance: number;
    quality: number;
    overallOEE: number;
  };
  financialImpact: {
    productionIncrease: number;
    costReduction: number;
    roi: number;
  };
  statisticalValidation: {
    confidenceLevel: number;
    pValue: number;
    sampleSize: number;
  };
}