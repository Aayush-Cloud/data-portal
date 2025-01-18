<template>
    <p :class="['custom-text', `custom-text--${variant}`]">
      <slot />
    </p>
  </template>
  
  <script>
  export default {
    name: 'CustomText',
    props: {
      variant: {
        type: String,
        default: 'primary', // Available: primary, secondary, accent
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-text {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-color);
  }
  
  .custom-text--primary {
    color: var(--primary-color);
  }
  
  .custom-text--secondary {
    color: var(--secondary-color);
  }
  
  .custom-text--accent {
    color: var(--primary-color);
    font-weight: bold;
  }
  </style>
  