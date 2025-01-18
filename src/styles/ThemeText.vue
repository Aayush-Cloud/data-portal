<template>
    <component 
      :is="tag" 
      :class="['theme-text', className]"
    >
      <slot></slot>
    </component>
  </template>
  
  <script>
  export default {
    name: 'ThemeText',
    props: {
      tag: {
        type: String,
        default: 'span'
      },
      className: {
        type: String,
        default: ''
      }
    }
  }
  </script>
  
  <style>
  .theme-text {
    color: var(--text-color);
    transition: color 0.3s ease;
  }
  </style>