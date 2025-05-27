<template lang="pug">
button.btn(
  :class="[variant, size, { 'full-width': fullWidth }]"
  :type="type"
  :disabled="disabled || loading"
  @click="$emit('click', $event)"
)
  span(v-if="loading") {{ loadingText }}
  span(v-else)
    slot
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '読み込み中...'
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

// eslint-disable-next-line no-undef
defineEmits(['click'])
</script>

<style scoped>
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.btn.primary {
  background-color: #3b82f6;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn.secondary {
  background-color: #6b7280;
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn.danger {
  background-color: #dc3545;
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn.success {
  background-color: #28a745;
  color: white;
}

.btn.success:hover:not(:disabled) {
  background-color: #218838;
}

.btn.warning {
  background-color: #ffc107;
  color: #212529;
}

.btn.warning:hover:not(:disabled) {
  background-color: #e0a800;
}

/* Sizes */
.btn.small {
  padding: 8px 16px;
  font-size: 12px;
}

.btn.medium {
  padding: 12px 20px;
  font-size: 14px;
}

.btn.large {
  padding: 16px 24px;
  font-size: 16px;
}

/* Full width */
.btn.full-width {
  width: 100%;
}
</style> 