import _ from 'lodash';
import math from 'mathjs';
import moment from 'moment';
import numeral from 'numeral';
import Vue from 'vue';

Vue.filter('duration', (str) =>
  moment()
    .subtract(str / 1000, 'seconds')
    .fromNow(true)
);

Vue.filter('percentage', (str) =>
  str
    ? math
        .chain(str)
        .subtract(1)
        .multiply(100)
        .format(4).value + '%'
    : 0
);

Vue.filter('data', (str) =>
  numeral(str)
    .multiply(1000)
    .format('0.00b')
);

Vue.filter('bandwidth', (str) => Vue.filter('data')(str) + '/s');

Vue.filter('confidence', (str) => numeral(str).format('0.[00]a') + '❤');

Vue.filter(
  'influence',
  (str) =>
    numeral(str)
      .multiply(1000)
      .format('0.[00]a') + '★/s'
);

Vue.filter('science', (str) => Vue.filter('percentage')(str));

Vue.filter('economy', (str) => Vue.filter('percentage')(str));

Vue.filter('society', (str) => Vue.filter('percentage')(str));

Vue.filter('neutral', (str) => Vue.filter('percentage')(str));

Vue.filter('bem', (str, elems, connector = '__', include = true) => {
  elems = _.isArray(elems) ? elems : [elems];
  var elements = _.join(
    _.map(elems, (elem) => `${str}${connector}${elem}`),
    ' '
  );
  return `${include ? str : ''} ${elements}`;
});

Vue.filter('el', (str, elems) => Vue.filter('bem')(str, elems, '__'));

Vue.filter('mod', (str, elems) => Vue.filter('bem')(str, elems, '--'));

Vue.filter('dash', (str, elems) => Vue.filter('bem')(str, elems, '-', false));
