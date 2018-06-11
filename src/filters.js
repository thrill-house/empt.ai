import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.chain(str).divide(1000).round().unit('s').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).format().value);
Vue.filter('percentage', str => str? math.chain(str).subtract(1).multiply(100).format(4).value + '%': 0);

Vue.filter('data', str => math.chain(str).multiply(1000).unit('B').format(5).value);
Vue.filter('bandwidth', str => math.chain(str).multiply(8000).unit('b').format(5).value + '/s');

Vue.filter('confidence', str => math.round(str) + ' followers');
Vue.filter('persuasion', str => math.round(str, 3) + ' likes/s');
Vue.filter('influence', str => Vue.filter('percentage')(str) + ' likes/s');
Vue.filter('journalCitations', str => Vue.filter('percentage')(str) + ' Citation boost');
Vue.filter('returnOnInvestment', str => Vue.filter('percentage')(str) + ' ROI boost');
Vue.filter('approvalRating', str => Vue.filter('percentage')(str) + ' Approval boost');