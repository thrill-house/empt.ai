import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.chain(str).divide(1000).round().unit('s').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).format().value);

Vue.filter('data', str => math.chain(str).multiply(1000).unit('B').format(5).value);
Vue.filter('bandwidth', str => math.chain(str).multiply(8000).unit('b').format(5).value + '/s');

Vue.filter('confidence', str => math.round(str) + ' followers');
Vue.filter('persuasion', str => math.round(str, 3) + ' likes/s');
Vue.filter('influence', str => Vue.filter('persuasion')(str));
Vue.filter('journalCitations', str => math.round(str, 3) + '% citations');
Vue.filter('returnOnInvestment', str => math.round(str, 3) + '% ROI');
Vue.filter('approvalRating', str => math.round(str, 3) + '% Approval');