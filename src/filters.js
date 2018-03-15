import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.unit(_.round(str / 1000), 's').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toString());
Vue.filter('bytes', str => math.unit(str, 'B').toString());
Vue.filter('frequency', str => math.unit(str, 'Hz').toString());