import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.unit(_.round(str / 1000), 's').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toString());
Vue.filter('bandwidth', str => math.unit(str * 8000, 'b').toString());
Vue.filter('data', str => math.unit(str * 1000, 'B').toString());
Vue.filter('processor', str => math.unit(str * 1000, 'Hz').toString());