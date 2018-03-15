import moment from 'moment'

const state = [
  { label: '1 sec', value: +moment.duration(1, 'seconds') },
  { label: '15 sec', value: +moment.duration(15, 'seconds') },
  { label: '30 sec', value: +moment.duration(30, 'seconds') },
  { label: '45 sec', value: +moment.duration(45, 'seconds') },
  { label: '1 min', value: +moment.duration(1, 'minutes') },
  { label: '5 min', value: +moment.duration(5, 'minutes') },
  { label: '10 min', value: +moment.duration(10, 'minutes') },
  { label: '15 min', value: +moment.duration(15, 'minutes') },
  { label: '20 min', value: +moment.duration(20, 'minutes') },
  { label: '30 min', value: +moment.duration(30, 'minutes') },
  { label: '45 min', value: +moment.duration(45, 'minutes') },
  { label: '1 hr', value: +moment.duration(1, 'hours') },
  { label: '1.5 hr', value: +moment.duration(1.5, 'hours') },
  { label: '2 hr', value: +moment.duration(2, 'hours') },
  { label: '2.5 hr', value: +moment.duration(2.5, 'hours') },
  { label: '3 hr', value: +moment.duration(3, 'hours') },
  { label: '3.5 hr', value: +moment.duration(3.5, 'hours') },
  { label: '4 hr', value: +moment.duration(4, 'hours') },
  { label: '6 hr', value: +moment.duration(6, 'hours') },
  { label: '9 hr', value: +moment.duration(9, 'hours') },
  { label: '12 hr', value: +moment.duration(12, 'hours') },
  { label: '1 day', value: +moment.duration(1, 'days') },
  { label: '1.5 day', value: +moment.duration(1.5, 'days') },
  { label: '2 day', value: +moment.duration(2, 'days') },
  { label: '3 day', value: +moment.duration(3, 'days') },
  { label: '4 day', value: +moment.duration(4, 'days') },
  { label: '5 day', value: +moment.duration(5, 'days') },
  { label: '6 day', value: +moment.duration(6, 'days') },
  { label: '1 week', value: +moment.duration(1, 'weeks') },
  { label: '2 weeks', value: +moment.duration(2, 'weeks') },
  { label: '3 weeks', value: +moment.duration(3, 'weeks') },
  { label: '1 month', value: +moment.duration(1, 'months') },
  { label: '2 month', value: +moment.duration(2, 'months') },
  { label: '3 month', value: +moment.duration(3, 'months') },
  { label: '6 month', value: +moment.duration(6, 'months') },
  { label: '1 year', value: +moment.duration(1, 'years') },
  { label: '1.5 year', value: +moment.duration(1.5, 'years') }
]

export default {
	state
}