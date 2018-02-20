var moment = require('moment')
var _ = require('lodash')

app.options = [
  { label: '1 sec', value: +moment.duration(1, 'seconds') },
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
];
  
app.dataSources = [
  { id: 1, label: 'Root (1)', type: 0, era: 1, dataSourcesId: 0, bandwidth: 1024 * 33.6, sockets: [
	    { id: 1 },
	    { id: 2 },
	    { id: 3 },
    ]
  },
  { id: 2, label: 'Neutral (2)', type: 0, era: 2, dataSourcesId: 1, bandwidth: 5/3, sockets: [
	    { id: 4 },
	    { id: 5 },
    ]
  },
  { id: 3, label: 'Neutral (3)', type: 0, era: 2, dataSourcesId: 1, bandwidth: 5/3, sockets: [
	    { id: 6 },
	    { id: 7 },
    ]
  },
  { id: 4, label: 'Neutral (4)', type: 0, era: 2, dataSourcesId: 1, bandwidth: 5/3, sockets: [
	    { id: 8 },
	    { id: 9 },
    ]
  },
  { id: 5, label: 'Science (1)', type: 'science', era: 3, dataSourcesId: 2, bandwidth: 8, sockets: [
	    { id: 10 },
	    { id: 11 },
	    { id: 12 },
    ]
  },
  { id: 6, label: 'Economy (1)', type: 'economy', era: 3, dataSourcesId: 3, bandwidth: 8, sockets: [
	    { id: 13 },
	    { id: 14 },
	    { id: 15 },
    ]
  },
  { id: 7, label: 'Society (1)', type: 'society', era: 3, dataSourcesId: 4, bandwidth: 8, sockets: [
	    { id: 16 },
	    { id: 17 },
	    { id: 18 },
    ]
  },
];

app.abilities = [
  {
    id: 1, label: 'Science (1)', type: 'science', era: 1, multipliers: [
	  	{ variant: -1, processor: 133, efficiency: 0.01 },
	  	{ variant: 0, processor: 166, efficiency: 0.02 },
	  	{ variant: 1, processor: 200, efficiency: 0.03 },
	  ]
  },
  {
    id: 2, label: 'Science (2)', type: 'science', era: 2, multipliers: [
	  	{ variant: -1, processor: 21, efficiency: 0.011 },
	  	{ variant: 0, processor: 31, efficiency: 0.021 },
	  	{ variant: 1, processor: 41, efficiency: 0.031 },
	  ]
  },
  {
    id: 3, label: 'Science (3)', type: 'science', era: 2, multipliers: [
	  	{ variant: -1, processor: 22, efficiency: 0.012 },
	  	{ variant: 0, processor: 32, efficiency: 0.022 },
	  	{ variant: 1, processor: 42, efficiency: 0.032 },
	  ]
  },
  {
    id: 4, label: 'Science (4)', type: 'science', era: 3, multipliers: [
	  	{ variant: -1, processor: 20, efficiency: 0.01 },
	  	{ variant: 0, processor: 30, efficiency: 0.02 },
	  	{ variant: 1, processor: 40, efficiency: 0.03 },
	  ]
  },
  {
    id: 5, label: 'Science (5)', type: 'science', era: 3, multipliers: [
	  	{ variant: -1, processor: 21, efficiency: 0.011 },
	  	{ variant: 0, processor: 31, efficiency: 0.021 },
	  	{ variant: 1, processor: 41, efficiency: 0.031 },
	  ]
  },
  {
    id: 6, label: 'Science (6)', type: 'science', era: 3, multipliers: [
	  	{ variant: -1, processor: 22, efficiency: 0.012 },
	  	{ variant: 0, processor: 32, efficiency: 0.022 },
	  	{ variant: 1, processor: 42, efficiency: 0.032 },
	  ]
  },
  {
    id: 7, label: 'Economy (1)', type: 'economy', era: 1, multipliers: [
	  	{ variant: -1, processor: 133, efficiency: 0.01 },
	  	{ variant: 0, processor: 166, efficiency: 0.02 },
	  	{ variant: 1, processor: 200, efficiency: 0.03 },
	  ]
  },
  {
    id: 8, label: 'Economy (2)', type: 'economy', era: 2, multipliers: [
	  	{ variant: -1, processor: 24, efficiency: 0.014 },
	  	{ variant: 0, processor: 34, efficiency: 0.024 },
	  	{ variant: 1, processor: 44, efficiency: 0.034 },
	  ]
  },
  {
    id: 9, label: 'Economy (3)', type: 'economy', era: 2, multipliers: [
	  	{ variant: -1, processor: 25, efficiency: 0.015 },
	  	{ variant: 0, processor: 35, efficiency: 0.025 },
	  	{ variant: 1, processor: 45, efficiency: 0.035 },
	  ]
  },
  {
    id: 10, label: 'Economy (4)', type: 'economy', era: 3, multipliers: [
	  	{ variant: -1, processor: 23, efficiency: 0.013 },
	  	{ variant: 0, processor: 33, efficiency: 0.023 },
	  	{ variant: 1, processor: 43, efficiency: 0.033 },
	  ]
  },
  {
    id: 11, label: 'Economy (5)', type: 'economy', era: 3, multipliers: [
	  	{ variant: -1, processor: 24, efficiency: 0.014 },
	  	{ variant: 0, processor: 34, efficiency: 0.024 },
	  	{ variant: 1, processor: 44, efficiency: 0.034 },
	  ]
  },
  {
    id: 12, label: 'Economy (6)', type: 'economy', era: 3, multipliers: [
	  	{ variant: -1, processor: 25, efficiency: 0.015 },
	  	{ variant: 0, processor: 35, efficiency: 0.025 },
	  	{ variant: 1, processor: 45, efficiency: 0.035 },
	  ]
  },
  {
    id: 13, label: 'Society (1)', type: 'society', era: 1, multipliers: [
	  	{ variant: -1, processor: 133, efficiency: 0.01 },
	  	{ variant: 0, processor: 166, efficiency: 0.02 },
	  	{ variant: 1, processor: 200, efficiency: 0.03 },
	  ]
  },
  {
    id: 14, label: 'Society (2)', type: 'society', era: 2, multipliers: [
	  	{ variant: -1, processor: 27, efficiency: 0.017 },
	  	{ variant: 0, processor: 37, efficiency: 0.027 },
	  	{ variant: 1, processor: 47, efficiency: 0.037 },
	  ]
  },
  {
    id: 15, label: 'Society (3)', type: 'society', era: 2, multipliers: [
	  	{ variant: -1, processor: 28, efficiency: 0.018 },
	  	{ variant: 0, processor: 38, efficiency: 0.028 },
	  	{ variant: 1, processor: 48, efficiency: 0.038 },
	  ]
  },
  {
    id: 16, label: 'Society (4)', type: 'society', era: 3, multipliers: [
	  	{ variant: -1, processor: 26, efficiency: 0.016 },
	  	{ variant: 0, processor: 36, efficiency: 0.026 },
	  	{ variant: 1, processor: 46, efficiency: 0.036 },
	  ]
  },
  {
    id: 17, label: 'Society (5)', type: 'society', era: 3, multipliers: [
	  	{ variant: -1, processor: 27, efficiency: 0.017 },
	  	{ variant: 0, processor: 37, efficiency: 0.027 },
	  	{ variant: 1, processor: 47, efficiency: 0.037 },
	  ]
  },
  {
    id: 18, label: 'Society (6)', type: 'society', era: 3, multipliers: [
	  	{ variant: -1, processor: 28, efficiency: 0.018 },
	  	{ variant: 0, processor: 38, efficiency: 0.028 },
	  	{ variant: 1, processor: 48, efficiency: 0.038 },
	  ]
  },
  {
    id: 19, label: 'Society (7)', type: 'society', era: 3, multipliers: [
	  	{ variant: -1, processor: 29, efficiency: 0.019 },
	  	{ variant: 0, processor: 39, efficiency: 0.029 },
	  	{ variant: 1, processor: 49, efficiency: 0.039 },
	  ]
  }
];

app.events = function() {
	return [
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
	];
}