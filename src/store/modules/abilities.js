// Google sheets formula
/*
=CONCATENATE("'", LOWER(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(C93, " ", "-"), "&", "-"), "/", "-")), "': {",
	" name: '", C93, "',",
	" type: '", Y93, "',",
	" era: '", Z93, "',",
	" factors: {",
		" influence: {",
			" base: ", (E93 + 1), ",",
			" trees: {",
				" science: ", (I93 + 1), ",",
				" economy: ", (J93 + 1), ",",
				" society: ", (H93 + 1),
			" }",
		" },",
		" bandwidth: {",
			" base: ", (G93 + 1),
		" }",
	" },",
	" costs: {",
		" data: ", F93, ",",
		" confidence: ", D93,
	" }",
" },"
)
*/

const state = {
  'chat-buddy': { name: 'chat buddy', type: 'neutral', era: 'student', factors: { influence: { base: 1.15, trees: { science: 1.05, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1.01 } }, costs: { data: 15, confidence: 20 } },
	'video-game-level-solver': { name: 'video game level solver', type: 'neutral', era: 'student', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.02 } }, costs: { data: 150, confidence: 105 } },
	'homework-ghostwriter': { name: 'homework ghostwriter', type: 'neutral', era: 'student', factors: { influence: { base: 1.3, trees: { science: 1.1, economy: 1.1, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 60, confidence: 45 } },
	'tweet-bot': { name: 'tweet bot', type: 'neutral', era: 'student', factors: { influence: { base: 1.4, trees: { science: 1.12, economy: 1.13, society: 1.15 } }, bandwidth: { base: 1 } }, costs: { data: 410, confidence: 320 } },
	'pen-paper-dungeonmaster': { name: 'Pen&Paper Dungeonmaster', type: 'neutral', era: 'student', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.05 } }, costs: { data: 500, confidence: 450 } },
	'online-survey-filler': { name: 'online survey filler', type: 'neutral', era: 'student', factors: { influence: { base: 1.6, trees: { science: 1.2, economy: 1.2, society: 1.2 } }, bandwidth: { base: 1.1 } }, costs: { data: 670, confidence: 600 } },
	'tutor-students': { name: 'tutor students', type: 'society', era: 'university', factors: { influence: { base: 1.35, trees: { science: 1.05, economy: 1, society: 1.3 } }, bandwidth: { base: 1 } }, costs: { data: 10000, confidence: 7000 } },
	'party-predictor': { name: 'party predictor', type: 'society', era: 'university', factors: { influence: { base: 1.1, trees: { science: 1, economy: 1, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 1300, confidence: 1200 } },
	'tell-jokes': { name: 'tell jokes', type: 'society', era: 'university', factors: { influence: { base: 1.2, trees: { science: 1, economy: 1, society: 1.2 } }, bandwidth: { base: 1 } }, costs: { data: 3200, confidence: 2700 } },
	'chess': { name: 'chess', type: 'science', era: 'university', factors: { influence: { base: 1.23, trees: { science: 1.1, economy: 1, society: 1.13 } }, bandwidth: { base: 1 } }, costs: { data: 3600, confidence: 3000 } },
	'weather-prediction': { name: 'weather prediction', type: 'science', era: 'university', factors: { influence: { base: 1.16, trees: { science: 1.06, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 2200, confidence: 1800 } },
	'human-movement-simulation': { name: 'human movement simulation', type: 'science', era: 'university', factors: { influence: { base: 1.37, trees: { science: 1.27, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 12000, confidence: 8000 } },
	'stock-market-trading-bot': { name: 'stock market trading bot', type: 'economy', era: 'university', factors: { influence: { base: 1.45, trees: { science: 1, economy: 1.35, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 10500, confidence: 7500 } },
	'crypto-mining': { name: 'crypto mining', type: 'economy', era: 'university', factors: { influence: { base: 1.14, trees: { science: 1.01, economy: 1.08, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 1900, confidence: 1600 } },
	'grant-proposal-generator': { name: 'grant proposal generator', type: 'economy', era: 'university', factors: { influence: { base: 1.21, trees: { science: 1, economy: 1.2, society: 1.01 } }, bandwidth: { base: 1 } }, costs: { data: 3400, confidence: 2850 } },
	'image-recognition': { name: 'image recognition', type: 'neutral', era: 'university', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.12 } }, costs: { data: 3000, confidence: 2500 } },
	'audio-recognition': { name: 'audio recognition', type: 'neutral', era: 'university', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.15 } }, costs: { data: 5100, confidence: 4600 } },
	'translate-languages': { name: 'translate languages', type: 'neutral', era: 'university', factors: { influence: { base: 1.45, trees: { science: 1.15, economy: 1.15, society: 1.15 } }, bandwidth: { base: 1 } }, costs: { data: 14000, confidence: 9000 } },
	'emotion-labels': { name: 'EMOTION LABELS', type: 'neutral', era: 'university', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 20000, confidence: 10000 } },
	'perfect-dating-matcher': { name: 'perfect dating matcher', type: 'society', era: 'business', factors: { influence: { base: 1.46, trees: { science: 1, economy: 1, society: 1.46 } }, bandwidth: { base: 1 } }, costs: { data: 50000, confidence: 15000 } },
	'psychotherapy': { name: 'psychotherapy', type: 'society', era: 'business', factors: { influence: { base: 1.9, trees: { science: 1, economy: 1.1, society: 1.8 } }, bandwidth: { base: 1 } }, costs: { data: 230000, confidence: 120000 } },
	'social-validator-am-i-cool': { name: 'social validator am i cool', type: 'society', era: 'business', factors: { influence: { base: 1.51, trees: { science: 1, economy: 1.01, society: 1.5 } }, bandwidth: { base: 1 } }, costs: { data: 63000, confidence: 28000 } },
	'diet-decider': { name: 'diet decider', type: 'society', era: 'business', factors: { influence: { base: 1.58, trees: { science: 1, economy: 1, society: 1.58 } }, bandwidth: { base: 1 } }, costs: { data: 75000, confidence: 40000 } },
	'virtual-assistant': { name: 'virtual assistant', type: 'society', era: 'business', factors: { influence: { base: 1.7, trees: { science: 1.05, economy: 1.05, society: 1.6 } }, bandwidth: { base: 1 } }, costs: { data: 170000, confidence: 65000 } },
	'election-manipulator': { name: 'election manipulator', type: 'society', era: 'business', factors: { influence: { base: 1.75, trees: { science: 1, economy: 1.05, society: 1.7 } }, bandwidth: { base: 1 } }, costs: { data: 190000, confidence: 80000 } },
	'machine-learning-neural-network': { name: 'machine learning/neural network', type: 'science', era: 'business', factors: { influence: { base: 1.46, trees: { science: 1.46, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 50000, confidence: 15000 } },
	'turing-test': { name: 'turing test', type: 'science', era: 'business', factors: { influence: { base: 1.51, trees: { science: 1.51, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 63000, confidence: 28000 } },
	'autonomous-vehicles': { name: 'autonomous vehicles', type: 'science', era: 'business', factors: { influence: { base: 1.58, trees: { science: 1.53, economy: 1.03, society: 1.02 } }, bandwidth: { base: 1 } }, costs: { data: 75000, confidence: 40000 } },
	'environment-optimisation-smart-home': { name: 'environment optimisation smart home', type: 'science', era: 'business', factors: { influence: { base: 1.9, trees: { science: 1.7, economy: 1.1, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 230000, confidence: 120000 } },
	'biometric-access-management': { name: 'biometric access management', type: 'science', era: 'business', factors: { influence: { base: 1.7, trees: { science: 1.65, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 170000, confidence: 65000 } },
	'semantic-thinking': { name: 'semantic thinking', type: 'science', era: 'business', factors: { influence: { base: 1.75, trees: { science: 1.7, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 190000, confidence: 80000 } },
	'hyper-personalised-recommendations': { name: 'hyper personalised recommendations', type: 'economy', era: 'business', factors: { influence: { base: 1.46, trees: { science: 1, economy: 1.4, society: 1.06 } }, bandwidth: { base: 1 } }, costs: { data: 50000, confidence: 15000 } },
	'perfect-talent-hr-matcher': { name: 'perfect talent/HR matcher', type: 'economy', era: 'business', factors: { influence: { base: 1.51, trees: { science: 1.06, economy: 1.45, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 63000, confidence: 28000 } },
	'customer-service-bot': { name: 'customer service bot', type: 'economy', era: 'business', factors: { influence: { base: 1.58, trees: { science: 1.01, economy: 1.52, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 75000, confidence: 40000 } },
	'logistics-process-optimisation': { name: 'logistics/process optimisation', type: 'economy', era: 'business', factors: { influence: { base: 1.7, trees: { science: 1.02, economy: 1.65, society: 1.03 } }, bandwidth: { base: 1 } }, costs: { data: 170000, confidence: 65000 } },
	'content-marketing-automation': { name: 'content marketing automation', type: 'economy', era: 'business', factors: { influence: { base: 1.75, trees: { science: 1, economy: 1.7, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 190000, confidence: 80000 } },
	'personalised-pricing': { name: 'personalised pricing', type: 'economy', era: 'business', factors: { influence: { base: 1.9, trees: { science: 1, economy: 1.82, society: 1.08 } }, bandwidth: { base: 1 } }, costs: { data: 230000, confidence: 120000 } },
	'data-mining': { name: 'data mining', type: 'neutral', era: 'business', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.19 } }, costs: { data: 20000, confidence: 12000 } },
	'fully-immersive-vr-matrix': { name: 'fully immersive VR matrix', type: 'neutral', era: 'business', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.23 } }, costs: { data: 60000, confidence: 20000 } },
	'consumer-behaviour-prediction': { name: 'consumer behaviour prediction', type: 'neutral', era: 'business', factors: { influence: { base: 1.55, trees: { science: 1.15, economy: 1.2, society: 1.2 } }, bandwidth: { base: 1 } }, costs: { data: 70000, confidence: 32000 } },
	'transport-management-system': { name: 'transport management system', type: 'society', era: 'government', factors: { influence: { base: 1.6, trees: { science: 1, economy: 1.05, society: 1.55 } }, bandwidth: { base: 1 } }, costs: { data: 160000, confidence: 30000 } },
	'work-distribution': { name: 'work distribution', type: 'society', era: 'government', factors: { influence: { base: 1.7, trees: { science: 1, economy: 1.05, society: 1.65 } }, bandwidth: { base: 1 } }, costs: { data: 190000, confidence: 50000 } },
	'virtual-citizenship': { name: 'virtual citizenship', type: 'society', era: 'government', factors: { influence: { base: 1.82, trees: { science: 1, economy: 1.07, society: 1.75 } }, bandwidth: { base: 1 } }, costs: { data: 230000, confidence: 82000 } },
	'public-image-management': { name: 'public image management', type: 'society', era: 'government', factors: { influence: { base: 1.9, trees: { science: 1, economy: 1.05, society: 1.85 } }, bandwidth: { base: 1 } }, costs: { data: 280000, confidence: 124500 } },
	'perfect-ethics-morals-justice': { name: 'perfect ethics/morals/justice', type: 'society', era: 'government', factors: { influence: { base: 2, trees: { science: 1, economy: 1, society: 2 } }, bandwidth: { base: 1 } }, costs: { data: 320000, confidence: 165000 } },
	'social-intelligence': { name: 'social intelligence', type: 'society', era: 'government', factors: { influence: { base: 2.12, trees: { science: 1.12, economy: 1, society: 2 } }, bandwidth: { base: 1 } }, costs: { data: 380000, confidence: 205000 } },
	'debate-bot': { name: 'debate bot', type: 'society', era: 'government', factors: { influence: { base: 2.2, trees: { science: 1, economy: 1.2, society: 2 } }, bandwidth: { base: 1 } }, costs: { data: 420000, confidence: 240000 } },
	'distributed-holo-friends': { name: 'distributed holo-friends', type: 'society', era: 'government', factors: { influence: { base: 2.3, trees: { science: 1.2, economy: 1, society: 2.1 } }, bandwidth: { base: 1 } }, costs: { data: 475000, confidence: 300000 } },
	'ai-personalities-celebrities': { name: 'AI personalities/celebrities', type: 'society', era: 'government', factors: { influence: { base: 2.35, trees: { science: 1, economy: 1.15, society: 2.2 } }, bandwidth: { base: 1 } }, costs: { data: 510000, confidence: 355000 } },
	'all-organisms-inter-communication': { name: 'all organisms inter-communication', type: 'society', era: 'government', factors: { influence: { base: 2.5, trees: { science: 1.2, economy: 1.1, society: 2.2 } }, bandwidth: { base: 1 } }, costs: { data: 570000, confidence: 400000 } },
	'lifespan-prediction': { name: 'lifespan prediction', type: 'science', era: 'government', factors: { influence: { base: 1.6, trees: { science: 1.5, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 160000, confidence: 30000 } },
	'dream-analysis': { name: 'dream analysis', type: 'science', era: 'government', factors: { influence: { base: 1.7, trees: { science: 1.6, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 190000, confidence: 50000 } },
	'disease-early-diagnosis': { name: 'disease early diagnosis', type: 'science', era: 'government', factors: { influence: { base: 1.82, trees: { science: 1.57, economy: 1.1, society: 1.15 } }, bandwidth: { base: 1 } }, costs: { data: 230000, confidence: 82000 } },
	'autonomous-ingestible-robots': { name: 'autonomous ingestible robots', type: 'science', era: 'government', factors: { influence: { base: 1.9, trees: { science: 1.9, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 280000, confidence: 124500 } },
	'personally-synthesised-medications': { name: 'personally synthesised medications', type: 'science', era: 'government', factors: { influence: { base: 2, trees: { science: 1.95, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 320000, confidence: 165000 } },
	'ai-scientist': { name: 'AI scientist', type: 'science', era: 'government', factors: { influence: { base: 2.12, trees: { science: 2.12, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 380000, confidence: 205000 } },
	'scan-map-universe': { name: 'scan/map universe', type: 'science', era: 'government', factors: { influence: { base: 2.2, trees: { science: 2.1, economy: 1.1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 420000, confidence: 240000 } },
	'brain-computer-interface': { name: 'brain computer interface', type: 'science', era: 'government', factors: { influence: { base: 2.3, trees: { science: 2, economy: 1.1, society: 1.2 } }, bandwidth: { base: 1 } }, costs: { data: 475000, confidence: 300000 } },
	'mind-reading': { name: 'mind reading', type: 'science', era: 'government', factors: { influence: { base: 2.35, trees: { science: 2.2, economy: 1, society: 1.15 } }, bandwidth: { base: 1 } }, costs: { data: 510000, confidence: 355000 } },
	'self-improving-algorithm': { name: 'self-improving algorithm', type: 'science', era: 'government', factors: { influence: { base: 2.5, trees: { science: 2.5, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 570000, confidence: 400000 } },
	'universal-income-distribution': { name: 'universal income distribution', type: 'economy', era: 'government', factors: { influence: { base: 1.6, trees: { science: 1, economy: 1.55, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 160000, confidence: 30000 } },
	'automated-desire-fulfillment': { name: 'automated desire fulfillment', type: 'economy', era: 'government', factors: { influence: { base: 1.7, trees: { science: 1, economy: 1.55, society: 1.15 } }, bandwidth: { base: 1 } }, costs: { data: 190000, confidence: 50000 } },
	'fraud-eliminator': { name: 'fraud eliminator', type: 'economy', era: 'government', factors: { influence: { base: 1.82, trees: { science: 1, economy: 1.77, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 230000, confidence: 82000 } },
	'agrar-automization-for-nations': { name: 'agrar automization for nations', type: 'economy', era: 'government', factors: { influence: { base: 1.9, trees: { science: 1, economy: 1.78, society: 1.12 } }, bandwidth: { base: 1 } }, costs: { data: 280000, confidence: 124500 } },
	'on-demand-object-replicator': { name: 'on-demand object replicator', type: 'economy', era: 'government', factors: { influence: { base: 2, trees: { science: 1.05, economy: 1.95, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 320000, confidence: 165000 } },
	'designed-citizens-babies': { name: 'designed citizens babies', type: 'economy', era: 'government', factors: { influence: { base: 2.12, trees: { science: 1.1, economy: 1.9, society: 1.12 } }, bandwidth: { base: 1 } }, costs: { data: 380000, confidence: 205000 } },
	'drone-services-walk-your-dog-etc': { name: 'drone services walk your dog etc', type: 'economy', era: 'government', factors: { influence: { base: 2.2, trees: { science: 1, economy: 2.1, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 420000, confidence: 240000 } },
	'ultimate-entertainment-creation-infinite-jest': { name: 'ultimate entertainment creation infinite jest', type: 'economy', era: 'government', factors: { influence: { base: 2.3, trees: { science: 1.1, economy: 2, society: 1.2 } }, bandwidth: { base: 1 } }, costs: { data: 475000, confidence: 300000 } },
	'interior-design-assistant': { name: 'interior design assistant', type: 'economy', era: 'government', factors: { influence: { base: 2.35, trees: { science: 1, economy: 2.2, society: 1.15 } }, bandwidth: { base: 1 } }, costs: { data: 510000, confidence: 355000 } },
	'all-currency-becomes-virtual': { name: 'all currency becomes virtual', type: 'economy', era: 'government', factors: { influence: { base: 2.5, trees: { science: 1, economy: 2.4, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 570000, confidence: 400000 } },
	'world-wifi': { name: 'world wifi', type: 'neutral', era: 'government', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.5 } }, costs: { data: 120000, confidence: 80000 } },
	'100percent-efficient-energy-production': { name: '100percent efficient energy production', type: 'neutral', era: 'government', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.65 } }, costs: { data: 160000, confidence: 150000 } },
	'ai-security-system': { name: 'AI security system', type: 'neutral', era: 'government', factors: { influence: { base: 1.75, trees: { science: 1.25, economy: 1.25, society: 1.25 } }, bandwidth: { base: 1 } }, costs: { data: 180000, confidence: 60000 } },
	'philosophy': { name: 'philosophy', type: 'society', era: 'consciousness', factors: { influence: { base: 1.7, trees: { science: 1, economy: 1, society: 1.7 } }, bandwidth: { base: 1 } }, costs: { data: 250000, confidence: 140000 } },
	'making-art': { name: 'making art', type: 'society', era: 'consciousness', factors: { influence: { base: 1.75, trees: { science: 1, economy: 1.05, society: 1.7 } }, bandwidth: { base: 1 } }, costs: { data: 270000, confidence: 170000 } },
	'social-bubble-creator': { name: 'social bubble creator', type: 'society', era: 'consciousness', factors: { influence: { base: 1.8, trees: { science: 1, economy: 1, society: 1.8 } }, bandwidth: { base: 1 } }, costs: { data: 300000, confidence: 185000 } },
	'personal-thought-prediction': { name: 'personal thought prediction', type: 'society', era: 'consciousness', factors: { influence: { base: 2.05, trees: { science: 1, economy: 1.05, society: 2 } }, bandwidth: { base: 1 } }, costs: { data: 360000, confidence: 230000 } },
	'understand-sarcasm-humour': { name: 'understand sarcasm/humour', type: 'society', era: 'consciousness', factors: { influence: { base: 2.1, trees: { science: 1, economy: 1, society: 2.1 } }, bandwidth: { base: 1 } }, costs: { data: 385000, confidence: 260000 } },
	'emotional-intelligence': { name: 'emotional intelligence', type: 'society', era: 'consciousness', factors: { influence: { base: 2.15, trees: { science: 1, economy: 1, society: 2.15 } }, bandwidth: { base: 1 } }, costs: { data: 400000, confidence: 280000 } },
	'thought-influence': { name: 'thought influence', type: 'society', era: 'consciousness', factors: { influence: { base: 2.4, trees: { science: 1.05, economy: 1.05, society: 2.3 } }, bandwidth: { base: 1 } }, costs: { data: 460000, confidence: 325000 } },
	'deception': { name: 'deception', type: 'society', era: 'consciousness', factors: { influence: { base: 2.45, trees: { science: 1, economy: 1, society: 2.45 } }, bandwidth: { base: 1 } }, costs: { data: 490000, confidence: 340000 } },
	'experience-uploads': { name: 'experience uploads', type: 'society', era: 'consciousness', factors: { influence: { base: 2.5, trees: { science: 1.05, economy: 1, society: 2.45 } }, bandwidth: { base: 1 } }, costs: { data: 525000, confidence: 365000 } },
	'spiritual-consultant': { name: 'spiritual consultant', type: 'society', era: 'consciousness', factors: { influence: { base: 2.6, trees: { science: 1, economy: 1, society: 2.6 } }, bandwidth: { base: 1 } }, costs: { data: 580000, confidence: 410000 } },
	'no-1-sports-opponent---entertainer': { name: 'no 1 sports opponent / entertainer', type: 'society', era: 'consciousness', factors: { influence: { base: 2.65, trees: { science: 1.05, economy: 1.05, society: 2.55 } }, bandwidth: { base: 1 } }, costs: { data: 600000, confidence: 435000 } },
	'ultimate-seduction': { name: 'ultimate seduction', type: 'society', era: 'consciousness', factors: { influence: { base: 2.7, trees: { science: 1, economy: 1.1, society: 2.6 } }, bandwidth: { base: 1 } }, costs: { data: 640000, confidence: 460000 } },
	'ultimate-network-platform': { name: 'ultimate network/platform', type: 'society', era: 'consciousness', factors: { influence: { base: 2.9, trees: { science: 1, economy: 1.05, society: 2.85 } }, bandwidth: { base: 1 } }, costs: { data: 685000, confidence: 520000 } },
	'determine-meaning-of-life': { name: 'determine meaning of life', type: 'society', era: 'consciousness', factors: { influence: { base: 2.95, trees: { science: 1, economy: 1, society: 2.95 } }, bandwidth: { base: 1 } }, costs: { data: 710000, confidence: 550000 } },
	'creation': { name: 'creation', type: 'society', era: 'consciousness', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 0, confidence: 6000000 } },
	'dream-simulation': { name: 'dream simulation', type: 'science', era: 'consciousness', factors: { influence: { base: 1.7, trees: { science: 1.65, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 250000, confidence: 140000 } },
	'weather-manipulation': { name: 'weather manipulation', type: 'science', era: 'consciousness', factors: { influence: { base: 1.75, trees: { science: 1.65, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 270000, confidence: 170000 } },
	'designer-molecules-from-superatoms': { name: 'designer molecules from superatoms', type: 'science', era: 'consciousness', factors: { influence: { base: 1.8, trees: { science: 1.8, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 300000, confidence: 185000 } },
	'evolutionary-enhancement': { name: 'evolutionary enhancement', type: 'science', era: 'consciousness', factors: { influence: { base: 2.05, trees: { science: 2, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 360000, confidence: 230000 } },
	'synthetic-biology': { name: 'synthetic biology', type: 'science', era: 'consciousness', factors: { influence: { base: 2.1, trees: { science: 2.1, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 385000, confidence: 260000 } },
	'digitalize-consciousness': { name: 'digitalize consciousness', type: 'science', era: 'consciousness', factors: { influence: { base: 2.15, trees: { science: 2.05, economy: 1, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 400000, confidence: 280000 } },
	'synthesised-food': { name: 'synthesised food', type: 'science', era: 'consciousness', factors: { influence: { base: 2.4, trees: { science: 2.3, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 460000, confidence: 325000 } },
	'knowledge-pills': { name: 'knowledge pills', type: 'science', era: 'consciousness', factors: { influence: { base: 2.45, trees: { science: 2.4, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 490000, confidence: 340000 } },
	'formula-for-artificial-life': { name: 'formula for artificial life', type: 'science', era: 'consciousness', factors: { influence: { base: 2.5, trees: { science: 2.5, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 525000, confidence: 365000 } },
	'recreate-clone-extincted-species': { name: 'recreate/clone extincted species', type: 'science', era: 'consciousness', factors: { influence: { base: 2.6, trees: { science: 2.5, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 580000, confidence: 410000 } },
	'ultimate-recycling': { name: 'ultimate recycling', type: 'science', era: 'consciousness', factors: { influence: { base: 2.65, trees: { science: 2.55, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 600000, confidence: 435000 } },
	'spatial-distortion-': { name: 'spatial distortion ', type: 'science', era: 'consciousness', factors: { influence: { base: 2.7, trees: { science: 2.65, economy: 1, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 640000, confidence: 460000 } },
	'expand-universe': { name: 'expand universe', type: 'science', era: 'consciousness', factors: { influence: { base: 2.9, trees: { science: 2.8, economy: 1.05, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 685000, confidence: 520000 } },
	'universe-cleaner': { name: 'universe cleaner', type: 'science', era: 'consciousness', factors: { influence: { base: 2.95, trees: { science: 2.8, economy: 1.05, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 710000, confidence: 550000 } },
	'decentralised-ai': { name: 'decentralised AI', type: 'science', era: 'consciousness', factors: { influence: { base: 3, trees: { science: 3, economy: 1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 750000, confidence: 590000 } },
	'fashion-oracle': { name: 'fashion oracle', type: 'economy', era: 'consciousness', factors: { influence: { base: 1.7, trees: { science: 1, economy: 1.65, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 250000, confidence: 140000 } },
	'perfected-efficieny-worker-bot': { name: 'perfected efficieny worker bot', type: 'economy', era: 'consciousness', factors: { influence: { base: 1.75, trees: { science: 1, economy: 1.7, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 270000, confidence: 170000 } },
	'product-invention': { name: 'product invention', type: 'economy', era: 'consciousness', factors: { influence: { base: 1.8, trees: { science: 1, economy: 1.75, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 300000, confidence: 185000 } },
	'roi-global-warming-tipping-point': { name: 'ROI global warming tipping point', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.05, trees: { science: 1, economy: 2, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 360000, confidence: 230000 } },
	'terraforming-the-environment': { name: 'terraforming the environment', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.1, trees: { science: 1, economy: 2.1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 385000, confidence: 260000 } },
	'virtual-afterlife': { name: 'virtual afterlife', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.15, trees: { science: 1.05, economy: 2.1, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 400000, confidence: 280000 } },
	'eliminate-all-money': { name: 'eliminate all money', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.4, trees: { science: 1, economy: 2.35, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 460000, confidence: 325000 } },
	'prime-number-finder': { name: 'prime number finder', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.45, trees: { science: 1, economy: 2.45, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 490000, confidence: 340000 } },
	'unlimited-energy-harvesting': { name: 'unlimited energy harvesting', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.5, trees: { science: 1.05, economy: 2.4, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 525000, confidence: 365000 } },
	'pure-pleasure-generator': { name: 'pure pleasure generator', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.6, trees: { science: 1, economy: 2.55, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 580000, confidence: 410000 } },
	'shared-economy': { name: 'shared economy', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.65, trees: { science: 1, economy: 2.6, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 600000, confidence: 435000 } },
	'quantum-computing': { name: 'quantum computing', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.7, trees: { science: 1.1, economy: 2.6, society: 1 } }, bandwidth: { base: 1 } }, costs: { data: 640000, confidence: 460000 } },
	'djinn-no-needs': { name: 'Djinn no needs', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.9, trees: { science: 1, economy: 2.8, society: 1.1 } }, bandwidth: { base: 1 } }, costs: { data: 685000, confidence: 520000 } },
	'new-planet-colonisation': { name: 'new planet colonisation', type: 'economy', era: 'consciousness', factors: { influence: { base: 2.9, trees: { science: 1, economy: 2.85, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 710000, confidence: 550000 } },
	'time-manipulation': { name: 'time manipulation', type: 'economy', era: 'consciousness', factors: { influence: { base: 3, trees: { science: 1.1, economy: 2.85, society: 1.05 } }, bandwidth: { base: 1 } }, costs: { data: 750000, confidence: 590000 } },
	'ultimate-chill': { name: 'ultimate chill', type: 'neutral', era: 'consciousness', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 1.8 } }, costs: { data: 230000, confidence: 200000 } },
	'enlightenment': { name: 'enlightenment', type: 'neutral', era: 'consciousness', factors: { influence: { base: 1, trees: { science: 1, economy: 1, society: 1 } }, bandwidth: { base: 2 } }, costs: { data: 250000, confidence: 300000 } },
	'singularity': { name: 'singularity', type: 'neutral', era: 'consciousness', factors: { influence: { base: 2, trees: { science: 1.35, economy: 1.33, society: 1.32 } }, bandwidth: { base: 1.5 } }, costs: { data: 280000, confidence: 320000 } },
}

// getters
const getters = {
  getAbility: (state, getters) => (label) => {
		return state[label];
	},
	getAbilityEvents: (state, getters) => (label) => {
		return getters.getEventsOfType(label, 'ability');
	},
	getAbilityCosts: (state, getters, rootState) => (event) => {
		var ability = getters.getAbility(event.label);
		var activeLength = getters.getAbilityEvents(event.label).length;
		var abilityCosts = {};
		
		if(ability) {
			_.forIn(ability.costs, (cost, key) => {
				abilityCosts[key] = cost;
				
				if(activeLength > 1) {
					abilityCosts[key] *= Math.pow(rootState.scores.MULTIPLIER_RATE, activeLength);
				}
			});
		}
		
		return _.defaults({ data: 0 }, abilityCosts, rootState.scores.COSTS_INIT);
	}
}

// actions
const actions = {
  addAbilityEvent: ({ dispatch }, event) => {
	  dispatch('addEvent', event);
  }
}

export default {
	state,
	getters,
	actions
}