<template>
  <div class="events-calendar">
    <h2>Eventos Pet-Friendly</h2>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from "@fullcalendar/core/locales/es";

export default {
  name: 'EventsCalendar',
  components: { FullCalendar },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth', // Esto debe coincidir con un plugin cargado
        locale: esLocale,
        events: [
          { title: 'Paseo perruno', start: '2025-02-12' },
          { title: 'Feria de mascotas', start: '2025-02-24' },
        ],
      },
    };
  },
};
</script>

<style scoped>
.events-calendar {
  padding: 20px;
}
</style>