<template lang="pug">
li.team-item(
  :class="{ active: isActive }"
  @click="$emit('select', team)"
)
  .team-info
    h3 {{ team.name }}
    p.description {{ team.description }}
    span.member-count Members: {{ team.memberCount }}
  .team-actions
    button.edit-btn(
      @click.stop="$emit('edit', team)"
    ) Edit
    button.delete-btn(
      @click.stop="$emit('remove', team)"
    ) Delete
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  team: {
    type: Object,
    required: true,
    validator: (team) => {
      return ['id', 'name', 'description', 'memberCount'].every(
        key => key in team
      )
    }
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'edit', 'remove'])
</script>

<style scoped>
.team-item {
  padding: 12px;
  border-radius: 8px;
  background-color: white;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.team-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.team-item.active {
  border: 2px solid #3b82f6;
}

.team-info {
  margin-bottom: 8px;
}

h3 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
}

.description {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #666;
}

.member-count {
  font-size: 0.8rem;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
}

.team-actions {
  display: flex;
  gap: 8px;
}

button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.edit-btn {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.edit-btn:hover {
  background-color: #c7d2fe;
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #fecaca;
}
</style>