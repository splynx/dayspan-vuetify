<template>

  <div class="ds-week">

    <template v-for="(day, i) in days">

      <ds-day
        v-bind="{$scopedSlots}"
        v-on="$listeners"
        :key="i"
        :day="day"
        :calendar="calendar"
        :placeholder="placeholder"
        :placeholder-for-create="placeholderForCreate"
        :time-format="timeFormat"
      ></ds-day>

    </template>

  </div>

</template>

<script>
import { Calendar, CalendarEvent } from 'dayspan';


export default {

  name: 'dsDayRow',

  props:
  {
    days:
    {
      required: true,
      type: Array
    },

    calendar:
    {
      required: true,
      type: Calendar
    },

    placeholder:
    {
      type: CalendarEvent
    },

    placeholderForCreate:
    {
      type: Boolean,
      default: false
    },

    timeFormat:
    {
      type: String,
      default: '12H'
    }
  },

  methods:
  {
  }
}
</script>

<style scoped lang="scss">

.ds-week {
  display: flex;
  flex: 1;
  min-height: 105px;
}

</style>
