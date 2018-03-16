import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.chain(str).divide(1000).round().unit('s').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).format().value);
Vue.filter('data', str => math.chain(str).multiply(1000).unit('B').format(5).value);
Vue.filter('confidence', str => math.round(str) + ' quorum');
Vue.filter('bandwidth', str => math.chain(str).multiply(8000).unit('b').format(5).value + '/s');
Vue.filter('processor', str => math.chain(str).multiply(1000).unit('Hz').format(5).value);
Vue.filter('persuasion', str => math.round(str) + ' likes/s');
Vue.filter('journalCitations', str => str + ' citations');
Vue.filter('returnOnInvestment', str => str + '% ROI');
Vue.filter('approvalRating', str => str + '% Approval');