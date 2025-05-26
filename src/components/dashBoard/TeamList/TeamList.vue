<template>
    <div class="panel team-list">
      <div class="panel-header">
        <span>팀 리스트</span>
        <AddTeamButton @add="onAddTeam" />
      </div>
      <ul class="panel-body">
        <TeamItem v-for="team in teams" :key="team.id" :team="team"
                  @edit="onEditTeam" @remove="onRemoveTeam" />
      </ul>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  import TeamItem from './TeamItem.vue'
  import AddTeamButton from './AddTeamButton.vue'
  
  const props = defineProps({
    teams: Array
  })
  const emit = defineEmits(['add', 'edit', 'remove'])
  
  function onAddTeam() { emit('add') }
  function onEditTeam(team) { emit('edit', team) }
  function onRemoveTeam(team) { emit('remove', team) }
  </script>