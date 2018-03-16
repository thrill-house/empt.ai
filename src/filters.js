import Vue from 'vue'
import math from 'mathjs'

Vue.filter('duration', str => math.unit(_.round(str / 1000), 's').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toString());
Vue.filter('kilobits', str => math.unit(str * 8000, 'b').toString());
Vue.filter('kilobytes', str => math.unit(str * 1000, 'B').toString());
Vue.filter('frequency', str => math.unit(str * 1000, 'Hz').toString());