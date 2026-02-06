<template>
  <div class="config-container">
    <!-- Sidebar / menú lateral -->
    <aside class="sidebar">
      <ul>
        <li
          @click="selected = 'association'"
          :class="{ active: selected === 'association' }"
        >
          Asociación
        </li>
        <li
          @click="selected = 'users'"
          :class="{ active: selected === 'users' }"
        >
          Usuarios
        </li>
        <li
          @click="selected = 'activities'"
          :class="{ active: selected === 'activities' }"
        >
          Actividades
        </li>
        <li
          @click="selected = 'projects'"
          :class="{ active: selected === 'projects' }"
        >
          Proyectos
        </li>
        <li
          @click="selected = 'economy'"
          :class="{ active: selected === 'economy' }"
        >
          Economía
        </li>
        <li
          @click="selected = 'communication'"
          :class="{ active: selected === 'communication' }"
        >
          Comunicación
        </li>
      </ul>
    </aside>

    <!-- Contenido principal según sección seleccionada -->
    <main class="content">
      <!--<AssociationSettings v-if="selected === 'association'" />
      <UserSettings v-if="selected === 'users'" />
      <ActivitySettings v-if="selected === 'activities'" />
      <ProjectSettings v-if="selected === 'projects'" />
      <EconomySettings v-if="selected === 'economy'" />
      <CommunicationSettings v-if="selected === 'communication'" /> -->
    </main>
  </div>
</template>

<script>
import AssociationSettings from '@/components/settings/AssociationSettings.vue'
import UserSettings from '@/components/settings/UserSettings.vue'
import ActivitySettings from '@/components/settings/ActivitySettings.vue'
import ProjectSettings from '@/components/settings/ProjectSettings.vue'
import EconomySettings from '@/components/settings/EconomySettings.vue'
import CommunicationSettings from '@/components/settings/CommunicationSettings.vue'

export default {
  name: 'Configuracion',
  components: {
    AssociationSettings,
    UserSettings,
    ActivitySettings,
    ProjectSettings,
    EconomySettings,
    CommunicationSettings,
  },
  data() {
    return {
      selected: 'association', // sección inicial
    }
  },
}
</script>

<style scoped>
.config-container {
  display: flex;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.sidebar {
  width: 220px;
  background: #f5f7fa;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: 0.2s;
}

.sidebar li:hover {
  background: #e0e6f0;
}

.sidebar li.active {
  background: #d0d8e8;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
