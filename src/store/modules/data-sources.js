const state = [
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
]

export default {
	state
}