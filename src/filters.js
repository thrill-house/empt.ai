import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.unit(_.round(str / 1000), 's').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toString());
Vue.filter('bits', str => math.unit(str, 'b').toString());
Vue.filter('bytes', str => math.unit(str / 8, 'B').toString());
Vue.filter('frequency', str => math.unit(str, 'Hz').toString());