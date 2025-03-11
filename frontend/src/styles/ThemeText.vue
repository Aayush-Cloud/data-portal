<template>
    <p :class="['custom-text', `custom-text--${variant}`]">
      <slot />
    </p>
  </template>
  
  <script>
  export default {
    name: "ThemeText",
    props: {
      variant: {
        type: String,
        default: "primary", // Options: primary, secondary
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-text {
    font-size: 1rem;
    color: var(--text-color);
  }
  
  .custom-text--primary {
    font-weight: bold;
  }
  
  .custom-text--secondary {
    font-weight: normal;
    color: var(--secondary-color);
  }
  </style>
  