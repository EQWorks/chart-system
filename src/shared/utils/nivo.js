// pulled from https://github.com/plouc/nivo/blob/f967380e2900d893f5174c5070743a9b4dffa9ec/packages/axes/src/compute.js
// to manually get number of ticks
import {
  timeMillisecond,
  utcMillisecond,
  timeSecond,
  utcSecond,
  timeMinute,
  utcMinute,
  timeHour,
  utcHour,
  timeDay,
  utcDay,
  timeWeek,
  utcWeek,
  timeSunday,
  utcSunday,
  timeMonday,
  utcMonday,
  timeTuesday,
  utcTuesday,
  timeWednesday,
  utcWednesday,
  timeThursday,
  utcThursday,
  timeFriday,
  utcFriday,
  timeSaturday,
  utcSaturday,
  timeMonth,
  utcMonth,
  timeYear,
  utcYear,
} from 'd3-time'

const timeByType = {
  millisecond: [timeMillisecond, utcMillisecond],
  second: [timeSecond, utcSecond],
  minute: [timeMinute, utcMinute],
  hour: [timeHour, utcHour],
  day: [timeDay, utcDay],
  week: [timeWeek, utcWeek],
  sunday: [timeSunday, utcSunday],
  monday: [timeMonday, utcMonday],
  tuesday: [timeTuesday, utcTuesday],
  wednesday: [timeWednesday, utcWednesday],
  thursday: [timeThursday, utcThursday],
  friday: [timeFriday, utcFriday],
  saturday: [timeSaturday, utcSaturday],
  month: [timeMonth, utcMonth],
  year: [timeYear, utcYear],
}

const timeTypes = Object.keys(timeByType)
const timeIntervalRegexp = new RegExp(`^every\\s*(\\d+)?\\s*(${timeTypes.join('|')})s?$`, 'i')

const isInteger = value =>
  typeof value === 'number' && isFinite(value) && Math.floor(value) === value

export const getScaleTicks = (scale, spec) => {
  // specific values
  if (Array.isArray(spec)) {
    return spec
  }

  // continuous scales
  if (scale.ticks) {
    // default behaviour
    if (spec === undefined) {
      return scale.ticks()
    }

    // specific tick count
    if (isInteger(spec)) {
      return scale.ticks(spec)
    }

    if (typeof spec === 'string') {
      // time interval
      const matches = spec.match(timeIntervalRegexp)
      if (matches) {
        // UTC is used as it's more predictible
        // however local time could be used too
        // let's see how it fits users' requirements
        const timeType = timeByType[matches[2]][scale.useUTC ? 1 : 0]
        if (matches[1] === undefined) {
          return scale.ticks(timeType)
        }

        return scale.ticks(timeType.every(Number(matches[1])))
      }

      throw new Error(`Invalid tickValues: ${spec}`)
    }
  }

  // non linear scale default
  return scale.domain()
}
