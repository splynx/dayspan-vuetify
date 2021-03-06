<template>

  <div class="ds-week-view-container">

    <ds-week-header
      v-bind="{$scopedSlots}"
      v-on="$listeners"
      :calendar="calendar"
      :placeholder="placeholder"
      :placeholder-for-create="placeholderForCreate"
      :days="calendar.days"
      :scroll-push="scrollPush"
    ></ds-week-header>

    <div class="ds-week-view-bottom">

      <div class="ds-week-view-scrollable" ref="scrollArea">

        <div class="ds-week-view-pane" ref="pane" :style="dayHeight">

          <div class="ds-week">

            <div class="ds-hour-list">

              <div class="ds-hour"
                v-for="(hour, i) in hoursList"
                :class="hourClasses[ i ]">

                <div class="ds-hour-text">{{ hour }}</div>

              </div>

            </div>

            <template v-for="day in calendar.days">

              <ds-day-times
                v-bind="{$scopedSlots}"
                v-on="$listeners"
                :key="day.dayIdentifier"
                :day="day"
                :placeholder="placeholder"
                :placeholder-for-create="placeholderForCreate"
                :calendar="calendar"
                :events-full-height="eventsFullHeight"
                :hours-format="this.hoursFormat"
              ></ds-day-times>

            </template>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script>
import { Calendar, CalendarEvent, Constants } from 'dayspan';


export default {

  name: 'dsDaysView',

  props:
  {
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

    scrollToFirst:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().scrollToFirst;
      }
    },

    scrollBuffer:
    {
      type: Number,
      default() {
        return this.$dsDefaults().scrollBuffer;
      }
    },

    hours:
    {
      type: Array,
      default() {
        return this.$dsDefaults().hours;
      }
    },

    eventsFullHeight:
    {
      type: Boolean,
      default: false
    },

    hoursFormat:
    {
      type: String,
      default() {
        return this.$dsDefaults().hoursFormat;
      }
    }
  },

  computed:
  {
    dayHeight()
    {
      return {
        height: this.$dayspan.dayHeight + 'px'
      };
    },

    hourClasses()
    {
      var currentHour = this.$dayspan.now.hour;

      return this.hoursList.map((hour, index) =>
      {
        return {
          'ds-same-hour': index === currentHour,
          'ds-past-hour': index < currentHour
        };
      });
    },

    hoursList()
    {
      if (this.hoursFormat === '12H') {
        return [
          '    ', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
          '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
        ];
      } else {
        return [
          '00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
          '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ];
      }
    }
  },

  data: vm => ({
    scrollPush: 0
  }),

  watch:
  {
    'calendar.start': 'scrollToEvent'
  },

  mounted()
  {
    this.scrollToEvent();
    this.scrollPush = this.getScrollPush();
  },

  methods:
  {
    scrollToEvent()
    {
      if (this.scrollToFirst)
      {
        let last = Constants.MINUTES_IN_DAY;
        let first = this.calendar
          .iterateDays()
          .reduce( last,
            (day, first) => day.iterateEvents().reduce( first,
              (event, first) => Math.min( first, event.start.hour * Constants.MINUTES_IN_HOUR + event.start.minute ),
              (event) => !event.fullDay
            )
          );

        if (last !== first)
        {
          let dayDelta = (first - this.scrollBuffer) / Constants.MINUTES_IN_HOUR;
          let dayPixels = dayDelta * this.$dayspan.hourHeight;

          this.$refs.scrollArea.scrollTop = Math.floor( dayPixels );
        }
      }
    },
    getScrollPush()
    {
      var area = this.$refs.scrollArea;
      var pane = this.$refs.pane;

      return area && pane ? (area.offsetWidth - pane.offsetWidth) : 0;
    }
  }

}
</script>

<style scoped lang="scss">

.ds-week-view-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  .ds-week-view-bottom {
    flex: 1 1 60%;
    overflow: hidden;
    display: flex;
    position: relative;
    flex-direction: column;
  }
  .ds-week-view-scrollable {
    overflow-y: scroll;
    flex: 1 1 auto;
    display: flex;
    align-items: flex-start;
  }
  .ds-week-view-pane {
    width: 100%;
    overflow-y: hidden;
    flex: none;
    display: flex;
    align-items: flex-start;

    .ds-day {
      position: relative;
    }
  }
  .ds-week {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
  }

  .ds-hour-list {
    flex: none;
    width: 44px;
    border-right: #e0e0e0 1px solid;
    user-select: none;

    .ds-hour {
      text-align: center;
      border-bottom: none;
      height: 40px;

      &:first-child .ds-hour-text {
        top: 0;
      }

      .ds-hour-text {
        display: block;
        position: relative;
        top: -6px;
        font-size: 10px;
        color: #212121;
      }

      /*
      &.ds-same-hour {
        border-right: 3px solid #4285f4;
        background-color: #f5f5f5;
      }

      &.ds-past-hour {
        background-color: #fafafa;
      }
      */
    }
  }
}

</style>
