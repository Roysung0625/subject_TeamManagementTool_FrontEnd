<template>
    <li class="team-item">
      <span class="team-name">{{ team.name }}</span>
      <div class="actions">
        <button @click="$emit('edit', team)"><img src="@/assets/pencil.png" alt="edit" /></button>
        <button @click="$emit('remove', team)"><img src="@/assets/trashcan.png" alt="del" /></button>
      </div>
    </li>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  const props = defineProps({ team: Object })
  </script>