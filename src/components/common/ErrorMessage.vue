<template lang="pug">
.error-message(v-if="message" :class="variant")
  .error-icon(v-if="showIcon")
    span ⚠️
  .error-content
    slot {{ message }}
  button.close-btn(v-if="closable" @click="$emit('close')")
    span ×
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  message: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: false
  }
})

// eslint-disable-next-line no-undef
defineEmits(['close'])
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid;
}

.error-message.error {
  color: #dc3545;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.error-message.warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeaa7;
}

.error-message.info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}

.error-icon {
  margin-right: 8px;
  font-size: 16px;
}

.error-content {
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}
</style> 