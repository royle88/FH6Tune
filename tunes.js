var ENGINE_SWAPS = [
  '1.0L I4 Motorbike',
  '1.1L V4 Motorbike',
  '1.2L I3 Motorbike',
  '1.3L 2 Rotor',
  '1.4L I4 Motorbike',
  '1.6L I3-T',
  '1.6L I4 VVT',
  '1.6L I4 Turbo Rally',
  '1.6L V6-T',
  '1.8L I4 Twin Charged',
  '2.0L F4 Turbo',
  '2.0L F4 Turbo Rally',
  '2.0L I4 VVT',
  '2.0L I4-T',
  '2.0L R3',
  '2.0L R3-T',
  '2.2L I4-T',
  '2.4L F4',
  '2.5L F4 Turbo',
  '2.5L F4-T',
  '2.5L I5 Turbo',
  '2.5L I5-T',
  '2.5L I6-T',
  '2.6L I6-TT',
  '2.6L 4 Rotor Racing',
  '2.9L V6-TT',
  '3.0L I6-T Racing',
  '3.0L I6-TT',
  '3.0L V6-TT',
  '3.0L V8 Racing',
  '3.2L I6',
  '3.2L F6-TT',
  '3.5L V8-TT',
  '3.5L TT Hybrid',
  '3.8L V6-TT',
  '3.8L F6-TT',
  'Racing V6',
  '4.0L F6',
  '4.0L V8',
  '4.0L V8-TT',
  '4.2L V8',
  '4.4L V8-TT',
  '4.5L V8',
  '4.6L V8 Hybrid',
  '4.7L V8',
  '4.8L V10',
  '5.0L V10',
  '5.2L V8',
  '5.2L V10',
  '5.2L V12',
  '5.5L V8',
  '5.8L V8 DSC',
  '6.0L V12',
  '6.0L V12 Racing',
  '6.1L V12',
  '6.2L V8',
  '6.2L V8 DSC',
  '6.2L V8-PDSC',
  '6.3L V12 Hybrid',
  '6.5L V12',
  '6.7L V8-T Diesel',
  '7.2L V8',
  '7.2L V8 Racing',
  '7.4L V8-TT',
  '7.7L V12',
  '8.4L V10',
  '8.9L V8 DSC',
  'Racing V12'
];

var ENGINE_CATEGORIES = {
  small: { label: 'Small (1.0L to 2.0L)', type: 'I3/I4/V4/R3/Rotor', traits: 'Lightweight, rev-happy, low PI cost. Good for lower classes where you need to stay within budget.' },
  mid: { label: 'Mid (2.2L to 3.8L)', type: 'I5/I6/V6/F4/F6/Rotor', traits: 'Great balance of power and weight. Turbo I6s and V6s are excellent for drift and road racing. Smooth, controllable power delivery.' },
  v8: { label: 'V8 (4.0L to 7.4L)', type: 'V8', traits: 'Strong mid-range torque, excellent for drift and road racing. The workhorse of Forza tuning. Heavier than I6s but more powerful.' },
  big: { label: 'Large (V10/V12, 4.8L+)', type: 'V10/V12', traits: 'Maximum power but heavy and expensive on PI. Best suited for S2 and R class builds, or drag racing where raw power is everything.' },
  hybrid: { label: 'Hybrid', type: 'Hybrid/Electric', traits: 'Instant electric torque fills gaps in the power band, giving strong acceleration from low RPM. Excellent for road racing corner exits and drag launches. Heavier than non-hybrid equivalents due to battery weight, but the torque fill makes them very driveable.' },
  racing: { label: 'Racing', type: 'Racing Engine', traits: 'Purpose-built racing engines with high-RPM power delivery and lighter internals. Excellent power-to-PI ratio but can be peaky. Best paired with close-ratio gearing to keep them in their narrow power band.' }
};

function categoriseEngine(name) {
  var lower = name.toLowerCase();
  if (lower.indexOf('hybrid') !== -1) return 'hybrid';
  if (lower.indexOf('racing') !== -1) return 'racing';
  if (lower.indexOf('v12') !== -1 || lower.indexOf('v10') !== -1) return 'big';
  if (lower.indexOf('v8') !== -1) return 'v8';
  var litres = parseFloat(name);
  if (!isNaN(litres) && litres <= 2.0) return 'small';
  return 'mid';
}

function recommendEngine(engines, discipline) {
  if (!engines || engines.length === 0) return null;

  var dominated = { drift: ['mid', 'v8', 'racing'], road: ['mid', 'v8', 'hybrid', 'racing'], street: ['mid', 'v8', 'hybrid'], offroad: ['mid', 'v8'], 'cross-country': ['mid', 'v8'], drag: ['big', 'v8', 'hybrid', 'racing'] };
  var preferred = dominated[discipline] || ['mid', 'v8'];

  var scored = engines.map(function (eng) {
    var cat = categoriseEngine(eng);
    var score = 0;
    if (preferred.indexOf(cat) !== -1) score += 10;
    if (cat === preferred[0]) score += 5;
    var lower = eng.toLowerCase();
    if (discipline === 'drift' || discipline === 'road' || discipline === 'street') {
      if (lower.indexOf('i6') !== -1 || lower.indexOf('i5') !== -1) score += 3;
      if (lower.indexOf('-tt') !== -1 || lower.indexOf(' tt') !== -1) score += 2;
      if (lower.indexOf('-t') !== -1 && lower.indexOf('-tt') === -1) score += 1;
    }
    if (discipline === 'drag') {
      var litres = parseFloat(eng);
      if (!isNaN(litres)) score += litres;
      if (lower.indexOf('dsc') !== -1 || lower.indexOf('pdsc') !== -1) score += 3;
    }
    if (discipline === 'offroad' || discipline === 'cross-country') {
      if (lower.indexOf('-t') !== -1) score += 2;
      if (lower.indexOf('diesel') !== -1) score += 4;
    }
    if (lower.indexOf('rally') !== -1 && (discipline === 'offroad' || discipline === 'cross-country')) score += 5;
    if (cat === 'hybrid') {
      if (discipline === 'road' || discipline === 'street') score += 4;
      if (discipline === 'drag') score += 6;
      if (discipline === 'drift') score -= 3;
    }
    if (cat === 'racing') {
      if (discipline === 'road') score += 5;
      if (discipline === 'drift') score += 3;
      if (discipline === 'drag') score += 4;
    }
    return { engine: eng, score: score, category: cat };
  });

  scored.sort(function (a, b) { return b.score - a.score; });
  return scored[0];
}


var CLASS_SCALE = { D: 0.45, C: 0.55, B: 0.65, A: 0.8, S1: 0.9, S2: 1.0, R: 1.0 };

function upgradeLevel(cls, tiers) {
  var scale = CLASS_SCALE[cls] || 0.8;
  if (scale <= 0.5) return tiers[0];
  if (scale <= 0.6) return tiers[Math.min(1, tiers.length - 1)];
  if (scale <= 0.7) return tiers[Math.min(2, tiers.length - 1)];
  if (scale <= 0.85) return tiers[Math.min(3, tiers.length - 1)];
  return tiers[tiers.length - 1];
}

function scaleValue(cls, base, low) {
  var s = CLASS_SCALE[cls] || 0.8;
  return Math.round((low + (base - low) * s) * 10) / 10;
}

var REFERENCE_WEIGHT = 1400;

function weightScale(weight) {
  return (weight || REFERENCE_WEIGHT) / REFERENCE_WEIGHT;
}

var KNOWLEDGE = {

  drift: {
    name: 'Drift',
    overview: 'Drift builds prioritise controlled oversteer, big steering angles, and smooth sustained slides. FH6 has a wider drift control range than previous titles, making it easier to hold angle and transition between corners. Power delivery matters more than peak horsepower, so you want strong mid-range torque to keep the wheels spinning without snapping the car around.',

    getTuning: function (cls, dt, weight, bhp) {
      var sections = [];
      var wm = weightScale(weight);
      var bhpScale = (bhp || 500) / 500;

      if (dt === 'FWD') {
        sections.push({ name: 'Drivetrain Warning', values: [
          { label: 'FWD Drift', value: 'Not recommended' }
        ], note: 'FWD cars cannot drift effectively. The driven front wheels fight against steering angle, making sustained slides nearly impossible. A RWD drivetrain swap is strongly recommended before attempting to drift this car. The swap will cost significant PI, so plan your other parts around it. The tuning values below assume you have converted to RWD or AWD.' });
      }

      sections.push({ name: 'Tyres', values: [
        { label: 'Front Tyre Width', value: upgradeLevel(cls, ['Stock', 'Stock', '245mm', '265mm']) },
        { label: 'Rear Tyre Width', value: 'Max available (315mm or 325mm)' },
        { label: 'Front Pressure', value: '29.0 PSI' },
        { label: 'Rear Pressure', value: bhpScale > 1.2 ? '41.0 to 43.0 PSI' : '39.0 to 41.0 PSI' }
      ], note: 'Wide rear tyres give more smoke and a wider grip window for holding slides. Front can be narrower for steering response. High rear pressure reduces the contact patch to break traction more easily. Low front pressure keeps the front planted at full lock.' + (bhpScale > 1.2 ? ' Higher power needs more rear pressure to break traction cleanly without gripping up mid-slide.' : '') });

      sections.push({ name: 'Gearing', values: [
        { label: 'Final Drive', value: (bhpScale > 1.2 ? scaleValue(cls, 3.50, 3.10) : scaleValue(cls, 3.80, 3.40)).toFixed(2) + ' (adjust to taste)' },
        { label: '1st Gear', value: '3.20 to 3.50' },
        { label: '2nd Gear', value: '2.00 to 2.30' },
        { label: '3rd Gear', value: '1.50 to 1.70' },
        { label: '4th Gear', value: '1.15 to 1.30' },
        { label: '5th Gear', value: '0.95 to 1.05' },
        { label: '6th Gear', value: '0.80 to 0.90' }
      ], note: 'Keep gears close together so you stay in the power band during transitions. Most drifting happens in 2nd and 3rd gear.' + (bhpScale > 1.2 ? ' With high power, a longer final drive prevents the rear from snapping loose too quickly.' : ' Shorten the final drive if you need quicker response, lengthen it for higher speed courses.') });

      sections.push({ name: 'Alignment', values: [
        { label: 'Front Camber', value: '-4.5 to -5.0' },
        { label: 'Rear Camber', value: '-0.5 to -1.0' },
        { label: 'Front Toe', value: '0.3 out' },
        { label: 'Rear Toe', value: '0.1 to 0.2 in' },
        { label: 'Caster', value: 'Max (~7.0)' }
      ], note: 'Aggressive front camber keeps the front tyres planted at full steering lock. Minimal rear camber maximises the rear contact patch for controlled slides. Front toe-out sharpens initial turn-in. Rear toe-in stabilises the rear during transitions. Maximum caster gives strong self-steer effect for maintaining angle.' });

      var frontArb = scaleValue(cls, 28.0, 20.0) * wm;
      var rearArb = scaleValue(cls, 10.0, 6.0) * wm;
      if (bhpScale > 1.4) {
        frontArb = frontArb * 0.85;
        rearArb = rearArb * 1.15;
      }
      sections.push({ name: 'Anti-Roll Bars', values: [
        { label: 'Front', value: frontArb.toFixed(1) },
        { label: 'Rear', value: rearArb.toFixed(1) }
      ], note: 'A stiff front ARB with a soft rear ARB promotes oversteer and makes it easier to initiate drifts.' + (bhpScale > 1.4 ? ' With very high power, the ARB split is narrowed slightly to prevent the rear snapping out too violently.' : ' If the car snaps too aggressively, soften the front slightly. If the rear feels too stable, soften the rear further.') });

      var frontSpring = scaleValue(cls, 650, 380) * wm * Math.max(bhpScale, 0.8);
      var rearSpring = scaleValue(cls, 480, 280) * wm * Math.max(bhpScale, 0.8);
      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: frontSpring.toFixed(0) + ' lbs/in' },
        { label: 'Rear Springs', value: rearSpring.toFixed(0) + ' lbs/in' },
        { label: 'Front Ride Height', value: scaleValue(cls, 12.5, 14.0).toFixed(1) + ' cm' },
        { label: 'Rear Ride Height', value: scaleValue(cls, 12.0, 13.5).toFixed(1) + ' cm' }
      ], note: 'Stiffer front springs help weight transfer to the rear during initiation. Softer rear springs keep the back end planted enough for control without killing the slide.' + (bhpScale > 1.0 ? ' Springs are stiffened to handle the extra power without the car squatting or wallowing.' : '') });

      var dampScale = Math.max(bhpScale, 0.8);
      sections.push({ name: 'Damping', values: [
        { label: 'Front Rebound', value: (8.0 * wm * dampScale).toFixed(1) },
        { label: 'Rear Rebound', value: (6.5 * wm * dampScale).toFixed(1) },
        { label: 'Front Bump', value: (3.0 * wm * dampScale).toFixed(1) },
        { label: 'Rear Bump', value: (2.5 * wm * dampScale).toFixed(1) }
      ], note: 'Higher front rebound resists weight transfer back to the front, keeping the rear light and loose. Lower bump values let the suspension absorb kerbs and bumps without unsettling the car mid-drift.' });

      sections.push({ name: 'Aero', values: [
        { label: 'Front Downforce', value: '60% to 70% of range (if fitted)' },
        { label: 'Rear Downforce', value: bhpScale > 1.4 ? '40% to 50% of range (if fitted)' : '30% to 40% of range (if fitted)' }
      ], note: 'Less rear downforce than front makes the rear end looser at speed.' + (bhpScale > 1.4 ? ' With very high power, more rear downforce helps keep the car controllable at speed without losing the ability to slide.' : ' If you struggle to hold angle at high speed, increase rear downforce slightly. If initiation is difficult, reduce rear further.') });

      sections.push({ name: 'Brakes', values: [
        { label: 'Brake Pressure', value: '100%' },
        { label: 'Brake Balance', value: '45% to 50%' }
      ], note: 'Rear-biased braking helps rotate the car into a drift on corner entry. In FH6, going as low as 45% gives stronger rear lock-up for initiating slides. Full brake pressure gives maximum control over deceleration.' });

      if (dt === 'AWD') {
        var rearAccel = bhpScale > 1.4 ? '90% to 95%' : '100%';
        sections.push({ name: 'Differential', values: [
          { label: 'Front Accel', value: '30% to 40%' },
          { label: 'Front Decel', value: '0% to 5%' },
          { label: 'Rear Accel', value: rearAccel },
          { label: 'Rear Decel', value: '10%' },
          { label: 'Centre Balance', value: '75% to 80% Rear' }
        ], note: 'AWD drift requires most of the power going to the rear. Keep front accel lock low so the front wheels can steer freely.' + (bhpScale > 1.4 ? ' Slightly lower rear accel lock helps prevent the rear snapping with very high power.' : '') });
      } else {
        var accelLock = bhpScale > 1.4 ? '85% to 95%' : '100%';
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: accelLock },
          { label: 'Deceleration', value: '10%' }
        ], note: (bhpScale > 1.4 ? 'With very high power, reducing accel lock slightly prevents the rear from breaking away too aggressively on throttle. ' : 'Full acceleration lock ensures both rear wheels spin together for consistent smoke and angle. ') + 'Low deceleration lock prevents the diff from locking on lift-off, which would snap the car straight mid-drift.' });
      }

      return sections;
    },

    tips: [
      'In FH6, most drifting happens in 3rd and 4th gear. Set your gearing so you can hold angle in 4th on medium corners and drop to 3rd for tight hairpins.',
      'If the car snaps into oversteer too violently, soften the front ARB by 2 to 3 points and add 1 to 2 points of rear ARB.',
      'If the rear feels too stable and you cannot initiate, increase rear tyre pressure by 1 to 2 PSI and reduce rear ARB.',
      'If you lose angle mid-drift, try increasing front camber (more negative) and raising caster.',
      'If the car understeers on entry before the drift, increase front toe-out by 0.1 and soften the front springs slightly.',
      'If transitions feel sluggish, tighten the gearing (shorter ratios in 3rd and 4th) and ensure your final drive lets you stay in the power band.',
      'For high speed courses, lengthen the final drive and increase rear downforce for stability.',
      'For technical courses with tight corners, shorten the final drive and reduce rear downforce for quicker rotation.',
      'FH6 has a wider drift control range than previous titles, so do not over-tune. Start with moderate settings and only go extreme if the car feels too stable.',
      'Snow tyres can work for drift builds if you want even less grip for easier slides. They cost less PI than drift tyres.',
      'Heavier cars generally need stiffer springs and more aggressive ARB splits to rotate properly.',
      'Lighter cars may need softer settings overall to avoid becoming too twitchy and unpredictable.',
      'Turn off Stability Control and Traction Control. Use Manual gears for full throttle and gear control during drifts.'
    ],

    engineSwapAdvice: 'For drift, pick an engine with strong mid-range torque rather than peak horsepower. Inline 6 turbos and V8s are excellent choices as they deliver smooth, controllable power. Avoid high-revving engines (V10s, V12s) unless you are comfortable managing sudden power delivery. If you are on a tight PI budget, a turbo inline 6 is usually the best balance of power and cost.'
  },

  road: {
    name: 'Road Racing',
    overview: 'Road racing builds are all about consistent lap times on tarmac circuits. You want maximum grip, sharp turn-in, stable braking, and strong corner exit traction. FH6 has more linear steering response and more forgiving braking than previous titles, so builds can be pushed closer to neutral balance. Aero is crucial at higher classes for maintaining grip through fast corners.',

    getTuning: function (cls, dt, weight) {
      var sections = [];
      var wm = weightScale(weight);

      sections.push({ name: 'Tyres', values: [
        { label: 'Front Tyre Width', value: upgradeLevel(cls, ['Stock', '245mm', '255mm', '275mm']) },
        { label: 'Rear Tyre Width', value: upgradeLevel(cls, ['Stock', '265mm', '285mm', '305mm']) },
        { label: 'Front Pressure', value: scaleValue(cls, 31.0, 29.0).toFixed(1) + ' PSI' },
        { label: 'Rear Pressure', value: scaleValue(cls, 31.0, 29.0).toFixed(1) + ' PSI' }
      ], note: 'Wider tyres give more grip but cost more PI. For tight budgets, prioritise rear width for traction. Equal pressures front and rear give balanced grip. Higher classes benefit from slightly higher pressures for sharper response.' });

      sections.push({ name: 'Gearing', values: [
        { label: 'Final Drive', value: 'Adjust to suit circuit' },
        { label: 'Strategy', value: 'Top of last gear should reach the longest straight\'s top speed' }
      ], note: 'Set your final drive so that you hit the rev limiter at the end of the longest straight on the circuit you are racing. Shorter gearing gives better acceleration but limits top speed. For a general-purpose setup, aim for the middle ground.' });

      sections.push({ name: 'Alignment', values: [
        { label: 'Front Camber', value: '-' + scaleValue(cls, 2.0, 1.0).toFixed(1) },
        { label: 'Rear Camber', value: '-' + scaleValue(cls, 1.5, 0.5).toFixed(1) },
        { label: 'Front Toe', value: '0.0 to 0.1 out' },
        { label: 'Rear Toe', value: '0.0 to 0.1 in' },
        { label: 'Caster', value: (weight > 1600 ? '6.5 to 7.0' : weight > 1200 ? '5.5 to 6.5' : '5.0 to 5.5') }
      ], note: 'Moderate camber compensates for body roll in fast corners to keep the full tyre surface on the road. Too much camber hurts straight-line braking grip. Caster scales with weight: heavier cars benefit from more caster for stability, lighter cars need less to avoid snappy turn-in.' });

      var frontArb = scaleValue(cls, 24.0, 15.0) * wm;
      var rearArb = dt === 'FWD' ? frontArb + 4 : frontArb - 3;
      sections.push({ name: 'Anti-Roll Bars', values: [
        { label: 'Front', value: frontArb.toFixed(1) },
        { label: 'Rear', value: rearArb.toFixed(1) }
      ], note: dt === 'FWD'
        ? 'FWD road cars benefit from a stiffer rear ARB relative to the front. This reduces understeer by promoting rear-end rotation through corners.'
        : 'Slightly stiffer front than rear gives a safe, mildly understeering balance. If you want a more neutral car, bring the rear closer to the front value. If the rear steps out too much on corner exit, increase the front further.'
      });

      var frontSpring = scaleValue(cls, 700, 300) * wm;
      var rearSpring = dt === 'FWD' ? frontSpring - 80 : frontSpring - 50;
      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: frontSpring.toFixed(0) + ' lbs/in' },
        { label: 'Rear Springs', value: rearSpring.toFixed(0) + ' lbs/in' },
        { label: 'Front Ride Height', value: scaleValue(cls, 11.0, 13.5).toFixed(1) + ' cm' },
        { label: 'Rear Ride Height', value: scaleValue(cls, 11.5, 14.0).toFixed(1) + ' cm' }
      ], note: 'Stiffer springs reduce body roll and improve responsiveness. Lower ride height lowers the centre of gravity for better cornering. Keep the rear slightly higher than the front to promote rear-end grip and stability under braking.' });

      var frontRebound = scaleValue(cls, 8.5, 5.5) * wm;
      var rearRebound = frontRebound - 0.3;
      sections.push({ name: 'Damping', values: [
        { label: 'Front Rebound', value: frontRebound.toFixed(1) },
        { label: 'Rear Rebound', value: rearRebound.toFixed(1) },
        { label: 'Front Bump', value: (frontRebound * 0.6).toFixed(1) },
        { label: 'Rear Bump', value: (rearRebound * 0.6).toFixed(1) }
      ], note: 'Bump should be roughly 60% of rebound. Higher rebound keeps the car stable during weight transfer. If the car feels harsh over bumps, reduce bump values slightly.' });

      sections.push({ name: 'Aero', values: [
        { label: 'Front Downforce', value: '50% to 60% of range (if fitted)' },
        { label: 'Rear Downforce', value: '55% to 65% of range (if fitted)' }
      ], note: 'More rear downforce than front gives a stable, understeering balance at high speed. If the car feels too heavy and understeery in fast corners, reduce rear or increase front. If the rear is unstable at speed, increase rear downforce.' });

      var brakeBalance = dt === 'FWD' ? '55% to 60%' : dt === 'AWD' ? '52% to 56%' : '50% to 55%';
      sections.push({ name: 'Brakes', values: [
        { label: 'Brake Pressure', value: scaleValue(cls, 100, 90).toFixed(0) + '%' },
        { label: 'Brake Balance', value: brakeBalance }
      ], note: 'Front-biased brake balance prevents rear lock-up under heavy braking. FWD cars need more front bias as the rear is lighter. If the car spins under braking, move the balance further forward.' });

      if (dt === 'AWD') {
        sections.push({ name: 'Differential', values: [
          { label: 'Front Accel', value: '25% to 35%' },
          { label: 'Front Decel', value: '5% to 10%' },
          { label: 'Rear Accel', value: scaleValue(cls, 70, 50).toFixed(0) + '%' },
          { label: 'Rear Decel', value: '15% to 20%' },
          { label: 'Centre Balance', value: '60% to 70% Rear' }
        ], note: 'Rear-biased centre balance gives a more natural, RWD-like feel while maintaining AWD stability. Low front accel lock prevents understeer on corner exit. Moderate rear accel lock controls wheelspin without losing traction.' });
      } else if (dt === 'FWD') {
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: '40% to 50%' },
          { label: 'Deceleration', value: '10% to 15%' }
        ], note: 'Moderate accel lock gives good traction on exit without inducing torque steer. Too high and the car will pull and understeer under power. Too low and you will spin the inside wheel on corner exit.' });
      } else {
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: scaleValue(cls, 60, 40).toFixed(0) + '%' },
          { label: 'Deceleration', value: '15% to 25%' }
        ], note: 'In FH6 the 40 to 60% range works best for RWD road racing. Too high and the rear pushes wide on exit; too low and you spin the inside rear. Deceleration lock of 15 to 25% lets the car rotate on trail braking without snapping.' });
      }

      return sections;
    },

    tips: [
      'In FH6, build the chassis first and add power last. Tyres, brakes, weight reduction, and suspension matter more than raw horsepower.',
      'If the car understeers mid-corner, soften the front ARB or stiffen the rear ARB by 2 to 3 points.',
      'If the rear steps out under braking, move brake balance forward by 2% to 3%.',
      'If you are losing time on straights, check your gearing. You should be near the rev limiter at the end of the longest straight.',
      'If the car bounces over kerbs, reduce bump stiffness on both axles.',
      'If the car feels floaty or disconnected at high speed, increase aero downforce and stiffen springs.',
      'If you have excessive wheelspin on corner exit, increase differential accel lock by 5% to 10%.',
      'Widening front tyres is one of the most effective grip upgrades in FH6. It often costs less PI than upgrading the tyre compound.',
      'For wet or mixed conditions, reduce tyre pressures by 1 to 2 PSI and soften the ARBs slightly.',
      'Test on the track you intend to race. A tune built on a highway will feel completely different on a tight circuit.',
      'Always install Race Differential and Race Anti-Roll Bars. These two upgrades unlock the most impactful tuning settings.',
      'Heavier cars need stiffer springs and more downforce to remain competitive.',
      'Lighter, agile cars may benefit from slightly softer springs to maintain mechanical grip.'
    ],

    engineSwapAdvice: 'For road racing, balance is key. Pick an engine that fills the PI budget without making the car too powerful for its grip level. V8s offer great mid-range torque for strong corner exits. Turbo inline 6s are efficient on PI. Avoid huge engines (V12, V10) unless you are building for S2 or R class, as the weight and PI cost rarely justify the power at lower classes.'
  },

  street: {
    name: 'Street Racing',
    overview: 'Street racing is similar to road racing but on mixed surfaces with traffic, tighter corners, and more elevation changes. You want a car that is quick to respond, forgiving over bumps, and strong on acceleration out of tight turns. Slightly softer suspension than full road racing helps on rougher surfaces.',

    getTuning: function (cls, dt, weight) {
      var sections = KNOWLEDGE.road.getTuning(cls, dt, weight);
      sections.forEach(function (sec) {
        if (sec.name === 'Springs') {
          sec.values.forEach(function (v) {
            if (v.label.indexOf('Springs') !== -1 && v.value.indexOf('lbs') !== -1) {
              var num = parseFloat(v.value);
              v.value = (num * 0.9).toFixed(0) + ' lbs/in';
            }
          });
          sec.note = 'Slightly softer springs than road racing help absorb bumps and uneven surfaces found on street circuits. This improves mechanical grip on rough roads.';
        }
        if (sec.name === 'Damping') {
          sec.values.forEach(function (v) {
            var num = parseFloat(v.value);
            if (!isNaN(num)) {
              v.value = (num * 0.9).toFixed(1);
            }
          });
          sec.note = 'Softer damping complements the softer springs for street circuits. The car will be more compliant over rough patches without sacrificing too much body control.';
        }
      });
      return sections;
    },

    tips: [
      'Street circuits have tighter corners than road courses. Consider shorter gearing for better acceleration.',
      'If the car bottoms out over bumps, raise the ride height slightly.',
      'Softer springs and damping help maintain grip on uneven road surfaces.',
      'Weight reduction is especially valuable for street racing as it improves acceleration between tight corners.',
      'If the car feels too soft and rolls excessively, stiffen the ARBs rather than the springs.'
    ],

    engineSwapAdvice: 'Street racing rewards strong low-end torque for acceleration out of tight corners. A V8 or turbo inline 6 works well. Avoid engines that need high RPM to make power as you spend most of your time in the mid-range.'
  },

  offroad: {
    name: 'Off-Road',
    overview: 'Off-road builds need soft, compliant suspension to absorb bumps and jumps, combined with enough grip to handle loose surfaces. Rally tyres are essential. Ride height should be raised to clear obstacles, and the suspension should soak up rough terrain without unsettling the car.',

    getTuning: function (cls, dt, weight) {
      var sections = [];
      var wm = weightScale(weight);

      if (dt === 'RWD') {
        sections.push({ name: 'Drivetrain Warning', values: [
          { label: 'RWD Off-Road', value: 'Not recommended' }
        ], note: 'RWD cars struggle significantly on loose surfaces. Without front-wheel drive, you lose traction out of corners and on climbs. An AWD conversion is strongly recommended for competitive off-road racing. The tuning values below will still work, but expect the car to be much harder to control than an AWD equivalent.' });
      }

      sections.push({ name: 'Tyres', values: [
        { label: 'Front Tyre Width', value: 'Widest available' },
        { label: 'Rear Tyre Width', value: 'Widest available' },
        { label: 'Front Pressure', value: '18.0 to 20.0 PSI' },
        { label: 'Rear Pressure', value: '18.0 to 20.0 PSI' }
      ], note: 'Off-road tyres are essential. Wider tyres provide more surface area on loose ground. Very low pressures maximise the contact patch on loose surfaces. FH6 rewards lower off-road pressures than previous titles.' });

      sections.push({ name: 'Gearing', values: [
        { label: 'Final Drive', value: 'Shorten by 10% to 15% from default' },
        { label: 'Strategy', value: 'Short gearing for acceleration, you rarely reach top speed off-road' }
      ]});

      sections.push({ name: 'Alignment', values: [
        { label: 'Front Camber', value: '-1.0' },
        { label: 'Rear Camber', value: '-0.5' },
        { label: 'Front Toe', value: '0.0' },
        { label: 'Rear Toe', value: '0.0' },
        { label: 'Caster', value: '5.0' }
      ], note: 'Minimal camber and neutral toe give the widest contact patch on uneven ground.' });

      sections.push({ name: 'Anti-Roll Bars', values: [
        { label: 'Front', value: (10.0 * wm).toFixed(1) + ' to ' + (15.0 * wm).toFixed(1) },
        { label: 'Rear', value: (10.0 * wm).toFixed(1) + ' to ' + (15.0 * wm).toFixed(1) }
      ], note: 'Soft, balanced ARBs let each wheel move independently over rough terrain. This keeps all four tyres in contact with the ground as much as possible.' });

      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: (200 * wm).toFixed(0) + ' to ' + (350 * wm).toFixed(0) + ' lbs/in' },
        { label: 'Rear Springs', value: (200 * wm).toFixed(0) + ' to ' + (350 * wm).toFixed(0) + ' lbs/in' },
        { label: 'Ride Height', value: 'Maximum' }
      ], note: 'Soft springs absorb bumps and jumps. Maximum ride height clears obstacles and prevents bottoming out.' });

      sections.push({ name: 'Damping', values: [
        { label: 'Front Rebound', value: (6.0 * wm).toFixed(1) + ' to ' + (7.0 * wm).toFixed(1) },
        { label: 'Rear Rebound', value: (6.0 * wm).toFixed(1) + ' to ' + (7.0 * wm).toFixed(1) },
        { label: 'Front Bump', value: (3.6 * wm).toFixed(1) + ' to ' + (4.2 * wm).toFixed(1) },
        { label: 'Rear Bump', value: (3.6 * wm).toFixed(1) + ' to ' + (4.2 * wm).toFixed(1) }
      ], note: 'Bump should be roughly 60% of rebound. Higher rebound than road builds prevents bouncing after jumps. Rally and off-road benefit from slightly more rebound to control body movement on rough terrain.' });

      sections.push({ name: 'Brakes', values: [
        { label: 'Brake Pressure', value: '90% to 95%' },
        { label: 'Brake Balance', value: '50% to 52%' }
      ]});

      if (dt === 'AWD' || dt === 'FWD') {
        sections.push({ name: 'Differential', values: [
          { label: 'Front Accel', value: '30% to 40%' },
          { label: 'Front Decel', value: '0% to 15%' },
          { label: 'Rear Accel', value: '55% to 70%' },
          { label: 'Rear Decel', value: '20% to 25%' },
          { label: 'Centre Balance', value: '65% to 75% Rear' }
        ], note: 'Off-road needs moderate diff lock so wheels can find grip independently on loose surfaces. Too much lock pushes wide on slippery corners. Slightly more rear decel than road builds helps control the car on loose descents.' });
      } else {
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: '45% to 55%' },
          { label: 'Deceleration', value: '10% to 15%' }
        ]});
      }

      return sections;
    },

    tips: [
      'If the car bottoms out on jumps, raise ride height and soften springs further.',
      'If the car slides too much on loose surfaces, reduce tyre pressure and soften ARBs.',
      'AWD is strongly recommended for all off-road builds.',
      'Shorter gearing is almost always better off-road as you need acceleration, not top speed.'
    ],

    engineSwapAdvice: 'Off-road favours torque over horsepower. A V8 or turbo inline 6 with strong low-end pull works best. Avoid high-revving engines as you need immediate throttle response on loose surfaces.'
  },

  'cross-country': {
    name: 'Cross Country',
    overview: 'Cross country combines off-road terrain with some tarmac sections and high-speed open areas. You need a build that handles both surfaces, with slightly stiffer suspension than pure off-road to cope with the faster sections while still absorbing rough terrain.',

    getTuning: function (cls, dt, weight) {
      var sections = KNOWLEDGE.offroad.getTuning(cls, dt, weight);
      var wm = weightScale(weight);
      sections.forEach(function (sec) {
        if (sec.name === 'Springs') {
          sec.values = [
            { label: 'Front Springs', value: (250 * wm).toFixed(0) + ' to ' + (400 * wm).toFixed(0) + ' lbs/in' },
            { label: 'Rear Springs', value: (250 * wm).toFixed(0) + ' to ' + (400 * wm).toFixed(0) + ' lbs/in' },
            { label: 'Ride Height', value: 'Maximum or near maximum' }
          ];
          sec.note = 'Slightly stiffer springs than pure off-road help with the faster tarmac sections. Still soft enough to handle rough terrain.';
        }
        if (sec.name === 'Anti-Roll Bars') {
          sec.values = [
            { label: 'Front', value: (12.0 * wm).toFixed(1) + ' to ' + (18.0 * wm).toFixed(1) },
            { label: 'Rear', value: (12.0 * wm).toFixed(1) + ' to ' + (18.0 * wm).toFixed(1) }
          ];
          sec.note = 'Slightly stiffer than off-road to reduce body roll on the faster sections, but still soft enough for terrain.';
        }
        if (sec.name === 'Differential' && (dt === 'AWD' || dt === 'FWD')) {
          sec.values = [
            { label: 'Front Accel', value: '35% to 45%' },
            { label: 'Front Decel', value: '5% to 15%' },
            { label: 'Rear Accel', value: '65% to 75%' },
            { label: 'Rear Decel', value: '20% to 25%' },
            { label: 'Centre Balance', value: '55% to 65% Rear' }
          ];
          sec.note = 'Cross country mixes surfaces, so a milder rear bias than pure off-road keeps the car stable on tarmac sections. More rear accel lock than off-road helps put power down on fast open terrain.';
        }
        if (sec.name === 'Tyres') {
          sec.values.forEach(function (v) {
            if (v.label.indexOf('Pressure') !== -1) v.value = '20.0 to 22.0 PSI';
          });
          sec.note = 'Slightly higher pressures than pure off-road for better response on tarmac sections. Still low enough for grip on loose surfaces.';
        }
      });
      return sections;
    },

    tips: [
      'Cross country events mix surfaces, so aim for a setup that is a compromise between off-road and road.',
      'Slightly stiffer springs and ARBs than pure off-road help on the faster tarmac sections.',
      'AWD is almost essential for competitive cross country builds.',
      'If you are losing time on the road sections, stiffen the suspension slightly. If you are bouncing off-road, soften it.'
    ],

    engineSwapAdvice: 'Similar to off-road, torque is king. A strong V8 or turbo engine works well. Cross country has more high-speed sections than off-road, so a bit more top-end power helps.'
  },

  drag: {
    name: 'Drag',
    overview: 'Drag racing is pure straight-line speed. Every upgrade should focus on maximising power and traction off the line. Weight reduction is critical. The car needs to launch hard without spinning the wheels, then accelerate as fast as possible to the finish.',

    getTuning: function (cls, dt, weight) {
      var sections = [];

      sections.push({ name: 'Tyres', values: [
        { label: 'Front Tyre Width', value: 'Stock or narrowest' },
        { label: 'Rear Tyre Width', value: 'Maximum' },
        { label: 'Front Pressure', value: '35.0 PSI' },
        { label: 'Rear Pressure', value: '26.0 to 28.0 PSI' }
      ], note: 'Narrow front tyres reduce rolling resistance. Max rear width for launch traction. Low rear pressure maximises the contact patch. Higher front pressure reduces drag.' });

      sections.push({ name: 'Gearing', values: [
        { label: 'Final Drive', value: 'Short for quarter-mile, long for half-mile' },
        { label: 'Strategy', value: 'Each gear should hit the rev limiter just as you shift' }
      ], note: 'Perfect gearing means spending as little time as possible between shifts. Each gear should be fully used.' });

      sections.push({ name: 'Alignment', values: [
        { label: 'All Camber', value: '0.0' },
        { label: 'All Toe', value: '0.0' },
        { label: 'Caster', value: '5.0' }
      ], note: 'Zero everything for maximum straight-line contact patch and minimal rolling resistance.' });

      sections.push({ name: 'Anti-Roll Bars', values: [
        { label: 'Front', value: 'Minimum' },
        { label: 'Rear', value: 'Minimum' }
      ], note: 'Minimum ARBs allow maximum weight transfer to the rear on launch.' });

      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: 'Soft' },
        { label: 'Rear Springs', value: 'Stiff' },
        { label: 'Front Ride Height', value: 'Maximum' },
        { label: 'Rear Ride Height', value: 'Minimum' }
      ], note: 'Soft front lets weight shift rearward on launch. Stiff rear supports the extra load. A raked stance promotes weight transfer.' });

      sections.push({ name: 'Differential', values: [
        { label: 'Acceleration', value: '100%' },
        { label: 'Deceleration', value: '0%' }
      ], note: 'Full lock on acceleration ensures both driven wheels put power down equally.' });

      return sections;
    },

    tips: [
      'Launch technique is everything. Practice feathering the throttle off the line to avoid wheelspin.',
      'AWD with full power will usually beat RWD due to superior launch traction.',
      'Gear ratios matter more than any other tuning setting in drag racing.',
      'If you are bogging down on launch, shorten first gear. If you are spinning, lengthen it.',
      'Consider using 8 to 10 gears for drag builds. More gears means less time between shifts and more time at peak power.',
      'Weight reduction is critical for drag. Every kilogram removed improves acceleration directly.'
    ],

    engineSwapAdvice: 'Biggest engine available. Power is everything. V12s, V10s, twin turbo V8s. Whatever makes the most horsepower within your PI budget.'
  }
};
