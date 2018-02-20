import moment from 'moment'

const state = {
	events: [
	  { type: 'dataSources', dataSourcesId: 1, timestamp: +moment(this.start) },
	  { type: 'abilities', abilitiesId: 1, dataSourcesId: 1, dataSourcesSlotId: 1, timestamp: +moment(this.start).add(10, 'seconds') },
	  { type: 'abilities', abilitiesId: 7, dataSourcesId: 1, dataSourcesSlotId: 2, timestamp: +moment(this.start).add(20, 'seconds') },
	  { type: 'abilities', abilitiesId: 13, dataSourcesId: 1, dataSourcesSlotId: 3, timestamp: +moment(this.start).add(30, 'seconds') },
	  { type: 'dataSources', dataSourcesId: 2, timestamp: +moment(this.start).add(1, 'minutes') },
	  { type: 'abilities', abilitiesId: 2, dataSourcesId: 2, dataSourcesSlotId: 4, timestamp: +moment(this.start).add(8, 'minutes') },
	  { type: 'abilities', abilitiesId: 8, dataSourcesId: 2, dataSourcesSlotId: 5, timestamp: +moment(this.start).add(13, 'minutes') },
	  { type: 'dataSources', dataSourcesId: 3, timestamp: +moment(this.start).add(20, 'minutes') },
	  { type: 'abilities', abilitiesId: 9, dataSourcesId: 3, dataSourcesSlotId: 6, timestamp: +moment(this.start).add(21, 'minutes') },
	  { type: 'abilities', abilitiesId: 14, dataSourcesId: 3, dataSourcesSlotId: 7, timestamp: +moment(this.start).add(34, 'minutes') },
	  { type: 'dataSources', dataSourcesId: 4, timestamp: +moment(this.start).add(0.9, 'hours') },
	  { type: 'abilities', abilitiesId: 3, dataSourcesId: 4, dataSourcesSlotId: 8, timestamp: +moment(this.start).add(1, 'hours') },
	  { type: 'abilities', abilitiesId: 15, dataSourcesId: 4, dataSourcesSlotId: 9, timestamp: +moment(this.start).add(2, 'hours') },
	  { type: 'dataSources', dataSourcesId: 5, timestamp: +moment(this.start).add(2.5, 'hours') },
	  { type: 'abilities', abilitiesId: 4, dataSourcesId: 3, dataSourcesSlotId: 10, timestamp: +moment(this.start).add(3, 'hours') },
	  { type: 'abilities', abilitiesId: 10, dataSourcesId: 3, dataSourcesSlotId: 11, timestamp: +moment(this.start).add(5, 'hours') },
	  { type: 'abilities', abilitiesId: 16, dataSourcesId: 3, dataSourcesSlotId: 12, timestamp: +moment(this.start).add(8, 'hours') },
	  { type: 'dataSources', dataSourcesId: 6, timestamp: +moment(this.start).add(1, 'days') },
	  { type: 'abilities', abilitiesId: 5, dataSourcesId: 3, dataSourcesSlotId: 13, timestamp: +moment(this.start).add(2, 'days') },
	  { type: 'abilities', abilitiesId: 11, dataSourcesId: 3, dataSourcesSlotId: 14, timestamp: +moment(this.start).add(3, 'days') },
	  { type: 'abilities', abilitiesId: 17, dataSourcesId: 3, dataSourcesSlotId: 15, timestamp: +moment(this.start).add(5, 'days') },
	  { type: 'dataSources', dataSourcesId: 7, timestamp: +moment(this.start).add(7, 'days') },
	  { type: 'abilities', abilitiesId: 6, dataSourcesId: 3, dataSourcesSlotId: 16, timestamp: +moment(this.start).add(8, 'days') },
	  { type: 'abilities', abilitiesId: 12, dataSourcesId: 3, dataSourcesSlotId: 17, timestamp: +moment(this.start).add(13, 'days') },
	  { type: 'abilities', abilitiesId: 18, dataSourcesId: 3, dataSourcesSlotId: 18, timestamp: +moment(this.start).add(21, 'days') },
	  { type: 'abilities', abilitiesId: 19, dataSourcesId: 3, dataSourcesSlotId: 16, timestamp: +moment(this.start).add(34, 'days') },
	]
}

export default {
	state
}