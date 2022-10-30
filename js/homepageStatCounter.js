import { CountUp } from "../js/countUp.min.js";
/*
    see demo at: https://inorganik.github.io/countUp.js/

    startVal?: number; // number to start at (0)
    decimalPlaces?: number; // number of decimal places (0)
    duration?: number; // animation duration in seconds (2)
    useGrouping?: boolean; // example: 1,000 vs 1000 (true)
    useEasing?: boolean; // ease animation (true)
    smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
    smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
    separator?: string; // grouping separator (',')
    decimal?: string; // decimal ('.')
    // easingFn: easing function for animation (easeOutExpo)
    easingFn?: (t: number, b: number, c: number, d: number) => number;
    formattingFn?: (n: number) => string; // this function formats result
    prefix?: string; // text prepended to result
    suffix?: string; // text appended to result
    numerals?: string[]; // numeral glyph substitution
*/

const options = {
  startVal: 50,
  decimalPlaces: 0,
  duration: 3,
  useEasing: false,
};

const options2 = {
  startVal: 0,
  decimalPlaces: 1,
  duration: 4,
  useEasing: false,
};

const option3 = {
  startVal: 50,
  decimalPlaces: 0,
  duration: 5,
  useEasing: false,
};

const option4 = {
  startVal: 0,
  decimalPlaces: 0,
  duration: 6,
  useEasing: false,
};

window.onload = function () {
  new CountUp("rank", 2, options).start();
  new CountUp("commute", 2.5, options2).start();
  new CountUp("staterank", 4, option3).start();
  new CountUp("percapdeath", 20, option4).start();

  /*Remember Dylan, you can also format it like this... 
    let rnk = new CountUp('rank', 2, options)
    let comm = new CountUp('commute', 2.5, options2)
    let stat = new CountUp('staterank', 4, option3)
    let percap = new CountUp('percapdeath', 20, option4)

    rnk.start()
    comm.start()
    stat.start()
    percap.start()
*/
};
