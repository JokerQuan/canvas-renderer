/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
*/

const Tween = {
  linear: function (t, b, c, d) { 
    return c * t / d + b; 
  },
  ease: function (t, b, c, d) { 
    return -c * ((t = t / d - 1) * t * t * t - 1) + b; 
  },
  'ease-in': function (t, b, c, d) { 
    return c * (t /= d) * t * t + b; 
  },
  'ease-out': function (t, b, c, d) { 
    return c * ((t = t / d - 1) * t * t + 1) + b; 
  },
  'ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) 
      return c / 2 * t * t * t + b; 
    return c / 2 * ((t -= 2) * t * t + 2) + b; 
  },
  bounce: function (t, b, c, d) { 
    if ((t /= d) < (1 / 2.75)) { 
      return c * (7.5625 * t * t) + b; 
    } else if (t < (2 / 2.75)) { 
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; 
    } else if (t < (2.5 / 2.75)) { 
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; 
    } else { 
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; } 
    }
}
