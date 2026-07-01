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

var REAR_ENGINE = ['911', '930', '959', '964', '993', '996', '997', '991', '992'];

var MID_ENGINE_MAKES = ['McLaren', 'Pagani', 'Koenigsegg', 'Rimac', 'Apollo', 'Zenvo', 'Noble', 'Radical', 'BAC', 'Gordon Murray Automotive'];

var MID_ENGINE_MODELS = [
  '4C', '8C Competizione', '33 Stradale', 'Tipo 33',
  'Atom', 'Nomad',
  'NSX', 'S2000',
  'R8',
  'i8',
  '718', 'Boxster', 'Cayman', 'Carrera GT', '918', '917', '550', '356',
  'Elise', 'Exige', 'Evora', 'Emira', 'Esprit',
  'Huracan', 'Aventador', 'Gallardo', 'Countach', 'Diablo', 'Murcielago',
  'Sesto Elemento', 'Veneno', 'Centenario', 'Revuelto', 'Miura',
  '360', '430', '458', '488', 'F8', 'SF90', 'LaFerrari', 'Enzo', 'F40', 'F50',
  '296', 'FXX', 'Dino', '308', '328', '348', '355', 'Testarossa', '288 GTO',
  '250 LM', '330 P4', 'J50',
  'GT', 'GT40',
  'MC12', 'MC20',
  'MR2', 'MR-S',
  'Pantera', 'Mangusta',
  'Corvette', 'Viper',
  'Huayra', 'Zonda',
  'Valhalla', 'Valkyrie', 'Vulcan',
  'P1', 'Senna', 'Speedtail', '720S', '650S', '600LT', '570S', 'F1',
  'One', 'AMG ONE',
  'Carrera GT', 'Spyder',
  'T.50', 'T.33',
  'Gemera', 'Jesko', 'Agera', 'Regera', 'One:1', 'CC8S', 'CCX',
  'Concept Two', 'Nevera',
  'IE', 'Intensa Emozione',
  'TS1', 'TSR-S',
  'Alpha', 'RXC',
  'Mono',
  'SIERRA Cars'
];

var FWD_MODELS = [
  'Civic', 'CRX', 'Integra', 'Prelude', 'Fit', 'Acty',
  'Golf', 'Scirocco', 'Corrado', 'Polo', 'Up', 'Rallye Golf',
  'Cooper', 'Countryman', 'Clubman',
  'Fiesta', 'Focus', 'Puma', 'Capri',
  'Clio', 'Megane', '5 Turbo',
  '205', '207', '208', '306', '308',
  'Veloster', 'i30',
  'Astra', 'Corsa', 'Kadett', 'Manta',
  'Peel', 'Trident',
  'AZ-1',
  'Eclipse', 'FTO'
];

function estimateDist(make, model, carName) {
  var i;
  for (i = 0; i < REAR_ENGINE.length; i++) {
    if (model === REAR_ENGINE[i] || model.indexOf(REAR_ENGINE[i]) !== -1) return 0.40;
  }
  if (make === 'Alpine') return 0.43;
  for (i = 0; i < MID_ENGINE_MAKES.length; i++) {
    if (make === MID_ENGINE_MAKES[i]) return 0.43;
  }
  for (i = 0; i < MID_ENGINE_MODELS.length; i++) {
    if (model === MID_ENGINE_MODELS[i] || model.indexOf(MID_ENGINE_MODELS[i]) !== -1) return 0.43;
  }
  if (make === 'Ferrari') return 0.52;
  if (make === 'Lamborghini') return 0.52;
  for (i = 0; i < FWD_MODELS.length; i++) {
    if (model === FWD_MODELS[i] || model.indexOf(FWD_MODELS[i]) !== -1) return 0.60;
  }
  if (make === 'MINI') return 0.60;
  if (make === 'Peel') return 0.60;
  if (make === 'Autozam') return 0.60;
  if (make === 'Peugeot') return 0.60;
  if (make === 'Opel') return 0.58;
  return 0.52;
}

function springRate(hz, axleLbs) {
  return (hz * hz * axleLbs) / 19.56;
}

function calcSprings(weight, frontDist, hz) {
  var totalLbs = weight * 2.2046;
  var frontLbs = totalLbs * frontDist;
  var rearLbs = totalLbs * (1 - frontDist);
  return {
    front: Math.round(springRate(hz, frontLbs)),
    rear: Math.round(springRate(hz, rearLbs))
  };
}

function calcFinalDrive(hp) {
  var p = hp > 800 ? hp / 2 : hp;
  return 4.25 + ((400 - p) / 6) * 0.01;
}

function getUpgrades(cls, dt, discipline) {
  var scale = CLASS_SCALE[cls] || 0.8;
  var steps = [];

  if (discipline === 'drift') {
    if (dt === 'FWD') {
      steps.push({ part: 'RWD Drivetrain Swap', reason: 'FWD cannot sustain drifts. This is the single most important upgrade for a drift build on a FWD car. Budget your remaining PI around this.' });
    }
    steps.push({ part: 'Engine Swap or Power Upgrades', reason: 'Target 600 to 750 BHP. Drift scoring rewards speed and angle, both of which need power. Inline 6 turbos and V8s deliver the smoothest, most controllable power for sustained slides.' });
    steps.push({ part: 'Drift Tyres', reason: 'Purpose-built for sliding. Lower grip than road tyres but predictable breakaway. Snow tyres are a cheaper PI alternative that slide even more easily.' });
    steps.push({ part: 'Race Transmission', reason: 'Unlocks individual gear ratio tuning. Close-ratio gearing keeps you in the power band across 3rd to 5th gear where most drifting happens. Set final drive so you can hold redline in 4th during a typical drift.' });
    steps.push({ part: 'Race Differential', reason: 'Unlocks acceleration and deceleration lock tuning. Without this you cannot control how the rear wheels share power, which is the foundation of drift control.' });
    steps.push({ part: 'Rear Tyre Width (Max)', reason: 'Wider rear tyres give more contact area for controlled, high-angle slides without spinning out.' });
    steps.push({ part: 'Front Tyre Width (Min)', reason: 'Narrower fronts reduce resistance at full steering lock and improve steering response during transitions.' });
    steps.push({ part: 'Race Suspension', reason: 'Unlocks spring rate, damping, and ride height tuning. Soft, compliant suspension helps with weight transfer for initiating and holding drifts.' });
    steps.push({ part: 'Race Anti-Roll Bars', reason: 'Unlocks front and rear ARB tuning. The stiff front / soft rear split is what makes the car want to oversteer predictably.' });
    steps.push({ part: 'Steering Lock Upgrade', reason: 'More steering angle means bigger drift angles and easier transitions. Install if available for your car.' });
    steps.push({ part: 'Weight Reduction', reason: 'Lower priority for drift. Some weight helps with momentum and stability mid-slide. Only reduce weight if you have PI to spare after power and tyres.' });

  } else if (discipline === 'drag') {
    steps.push({ part: 'Biggest Engine Swap Available', reason: 'Drag is pure power. The largest engine you can fit gives the most horsepower per PI spent. V12s, twin-turbo V8s, and supercharged options are all strong.' });
    steps.push({ part: 'Max Power Upgrades', reason: 'Stack turbo, intercooler, exhaust, intake, cam, valves, and displacement on top of the engine swap. Every horsepower matters in a straight line.' });
    if (dt === 'RWD') {
      steps.push({ part: 'Consider AWD Swap', reason: 'AWD launches harder than RWD because all four wheels put power down. The PI cost is significant but the launch advantage usually outweighs it at most classes.' });
    }
    steps.push({ part: 'Race Transmission (10-Speed)', reason: 'More gears means less time between shifts and more time at peak power. 10-speed is ideal for keeping the engine at maximum output through the entire run.' });
    steps.push({ part: 'Race Differential', reason: 'Unlocks accel and decel lock. Full acceleration lock ensures both driven wheels put power down equally for maximum traction.' });
    steps.push({ part: 'Rear Tyre Width (Max)', reason: 'Maximum rear contact patch for launch traction. This is where your power meets the road.' });
    steps.push({ part: 'Full Weight Reduction', reason: 'Every kilogram removed improves acceleration directly. Lighter cars reach top speed faster.' });
    steps.push({ part: 'Front Tyre Width (Min or Stock)', reason: 'Narrow fronts reduce rolling resistance and aerodynamic drag. The front tyres do not drive the car in a straight line.' });
    steps.push({ part: 'Race Suspension', reason: 'Unlocks spring and ride height tuning for the raked launch stance (front high, rear low) that promotes weight transfer.' });

  } else if (discipline === 'offroad' || discipline === 'cross-country') {
    if (dt === 'RWD') {
      steps.push({ part: 'AWD Drivetrain Swap', reason: 'RWD is severely disadvantaged on loose surfaces. AWD gives traction on all four wheels for climbing, cornering, and launching out of slow sections.' });
    }
    steps.push({ part: 'Engine Swap or Power Upgrades', reason: 'Power wins off-road. Faster acceleration out of corners and up hills makes a bigger difference than marginal handling gains. A strong V8 or turbo engine is the foundation.' });
    steps.push({ part: 'Rally or Off-Road Tyres', reason: 'These compounds are designed for loose surfaces. Road tyres on dirt lose massive amounts of grip. Essential for any competitive off-road build.' });
    steps.push({ part: 'Race Transmission', reason: 'Unlocks gear ratio tuning. Short gearing is critical off-road for strong acceleration between obstacles. You rarely reach top speed, so shorten everything.' });
    steps.push({ part: 'Race Differential', reason: 'Unlocks front, rear, and centre diff tuning. Moderate lock lets individual wheels find grip on uneven surfaces without pushing wide.' });
    steps.push({ part: 'Race Suspension', reason: 'Unlocks spring rate, damping, and ride height. Soft springs and maximum ride height absorb bumps and clear obstacles without bottoming out.' });
    steps.push({ part: 'Race Anti-Roll Bars', reason: 'Unlocks ARB tuning. Soft, balanced ARBs let each wheel move independently over rough terrain, keeping all four tyres on the ground.' });
    steps.push({ part: 'Tyre Width (Both Axles)', reason: 'Wider tyres provide more surface area on loose ground. Widen both front and rear equally for balanced grip.' });
    steps.push({ part: 'Weight Reduction', reason: 'Lighter cars are more agile over rough terrain and less likely to bottom out on jumps. Spend remaining PI here after power and handling.' });
    steps.push({ part: 'Race Brakes', reason: 'Unlocks brake balance tuning. Lower priority off-road as you brake less, but useful for controlling the car on steep descents.' });

  } else {
    steps.push({ part: 'Engine Swap or Power Upgrades', reason: 'Power is the biggest performance differentiator in FH6. More horsepower means faster straights and stronger exits, which add up to bigger lap time gains than any handling upgrade. Fill the car with as much power as the PI budget allows.' });
    steps.push({ part: 'Race Transmission', reason: 'Unlocks individual gear ratio and final drive tuning. Matched gearing keeps the engine at peak power through every corner exit and straight. Without this, extra power is wasted bouncing off the limiter or bogging down.' });
    if (scale <= 0.55) {
      steps.push({ part: 'Sport Tyres', reason: 'At ' + cls + ' class, sport compound is the best grip upgrade you can afford. Semi-slick and slick cost too much PI at this level and eat into your power budget.' });
    } else if (scale <= 0.7) {
      steps.push({ part: 'Semi-Slick Tyres', reason: 'At ' + cls + ' class, semi-slick is the sweet spot. Enough grip to put the power down without eating too much PI.' });
    } else if (scale <= 0.9) {
      steps.push({ part: 'Semi-Slick or Slick Tyres', reason: 'At ' + cls + ' class you can afford slick compound. The extra grip lets you carry more speed through corners and get on the power earlier.' });
    } else {
      steps.push({ part: 'Slick Tyres', reason: 'At ' + cls + ' class, slick compound is essential. Maximum mechanical grip lets you exploit all that power on corner exit without wheelspin.' });
    }
    steps.push({ part: 'Race Differential', reason: 'Unlocks acceleration and deceleration lock. Controls how the power reaches the wheels on corner exit. Without it you cannot manage wheelspin or trail braking.' });
    steps.push({ part: 'Front Tyre Width', reason: 'Widening the front tyres is one of the cheapest grip upgrades per PI point. More front grip means you can carry speed into corners and use the power earlier on exit.' });
    steps.push({ part: 'Race Anti-Roll Bars', reason: 'Unlocks front and rear ARB tuning. The ARB split controls whether the car understeers or oversteers. Use the mechanical balance readout to dial it to 0.60.' });
    steps.push({ part: 'Race Suspension', reason: 'Unlocks spring rate, damping, and ride height tuning. Minimum ride height lowers the centre of gravity. Springs calculated from your weight distribution give an accurate front-rear split.' });
    steps.push({ part: 'Rear Tyre Width', reason: 'Wider rears improve traction on corner exit, letting you get on the power harder and earlier. Especially important for RWD cars with high power.' });
    steps.push({ part: 'Weight Reduction', reason: 'Lighter cars brake later, turn faster, and accelerate harder. Spend remaining PI on weight reduction after power and tyres are sorted.' });
    if (scale >= 0.85) {
      steps.push({ part: 'Forza Aero (Front and Rear)', reason: 'At ' + cls + ' class, adjustable aero is essential for high-speed grip. The aero balance readout lets you target 0.40 to 0.45 for stability through fast corners.' });
    }
    steps.push({ part: 'Race Brakes', reason: 'Unlocks brake balance tuning. Prevents rear lock-up under heavy braking and lets you brake later into corners.' });
    if (dt === 'FWD' && (discipline === 'road' || discipline === 'street')) {
      steps.push({ part: 'Consider RWD or AWD Swap', reason: 'FWD naturally understeers under power. At higher classes, a drivetrain swap can unlock much more potential, but budget your PI around the swap cost.' });
    }
  }

  return steps;
}

var KNOWLEDGE = {

  drift: {
    name: 'Drift',
    overview: 'Drift builds prioritise controlled oversteer, big steering angles, and smooth sustained slides. FH6 has a wider drift control range than previous titles, making it easier to hold angle and transition between corners. Power delivery matters more than peak horsepower, so you want strong mid-range torque to keep the wheels spinning without snapping the car around.',

    getTuning: function (cls, dt, weight, bhp, frontDist) {
      var sections = [];
      var wm = weightScale(weight);
      var bhpScale = (bhp || 500) / 500;
      var fd = frontDist || 0.52;

      if (dt === 'FWD') {
        sections.push({ name: 'Drivetrain Warning', values: [
          { label: 'FWD Drift', value: 'Not recommended' }
        ], note: 'FWD cars cannot drift effectively. The driven front wheels fight against steering angle, making sustained slides nearly impossible. A RWD drivetrain swap is strongly recommended before attempting to drift this car. The swap will cost significant PI, so plan your other parts around it. The tuning values below assume you have converted to RWD or AWD.' });
      }

      sections.push({ name: 'Tyres', values: [
        { label: 'Compound', value: 'Drift or Snow (snow gives easier slides, less PI)' },
        { label: 'Front Tyre Width', value: 'Narrowest available' },
        { label: 'Rear Tyre Width', value: 'Widest available (315mm or 325mm)' },
        { label: 'Front Pressure', value: '31.0 PSI' },
        { label: 'Rear Pressure', value: '30.0 to 33.0 PSI' }
      ], note: 'Meta drift pressures sit around 30 to 33 PSI rear on drift compound. This lets the rear break traction predictably without sudden grip spikes. Narrow front tyres improve steering response at full lock. Snow compound is a viable alternative that costs less PI and slides more easily.' });

      var driftFd = 3.60;
      if (bhp > 0) {
        driftFd = calcFinalDrive(bhp) - 0.3;
        if (driftFd < 2.80) driftFd = 2.80;
        if (driftFd > 3.80) driftFd = 3.80;
      }
      sections.push({ name: 'Gearing', values: [
        { label: 'Final Drive', value: driftFd.toFixed(2) + ' (adjust to taste)' },
        { label: 'Primary Drift Gear', value: '4th (medium corners)' },
        { label: 'Tight Corners', value: '3rd' },
        { label: 'Fast Sweepers', value: '5th' }
      ], note: 'Set the final drive so you can hover at the redline in 4th gear during a typical drift without bouncing off the limiter. Close-ratio gears keep you in the power band during transitions. Most competitive drifting in FH6 happens in 3rd to 5th gear.' });

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

      var driftHz = 2.1 + (bhpScale - 1.0) * 0.15;
      if (driftHz < 2.0) driftHz = 2.0;
      if (driftHz > 2.4) driftHz = 2.4;
      var driftSprings = calcSprings(weight, fd, driftHz);
      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: driftSprings.front + ' lbs/in' },
        { label: 'Rear Springs', value: driftSprings.rear + ' lbs/in' },
        { label: 'Front Ride Height', value: 'Minimum' },
        { label: 'Rear Ride Height', value: 'Minimum' }
      ], note: 'Drift springs target 2.1 to 2.4 Hz ride frequency depending on BHP. Higher power needs stiffer springs for stability. These values are calculated from your car\'s weight and distribution.' });

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
        { label: 'Brake Balance', value: '45% to 50%' },
        { label: 'Brake Pressure', value: '100%' }
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
        var driftAccel = bhpScale > 1.4 ? '65% to 80%' : bhpScale > 1.0 ? '80% to 90%' : '85% to 100%';
        var driftDecel = bhpScale > 1.4 ? '25% to 40%' : '15% to 25%';
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: driftAccel },
          { label: 'Deceleration', value: driftDecel }
        ], note: 'Meta drift diff runs 65 to 90% accel lock. Below 70% gives inconsistent lines; near 100% makes the car twitchy. Higher decel (15 to 40%) lets the car rotate freely on corner entry. With high power, lower both values to keep the car controllable.' });
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

    engineSwapAdvice: 'The power sweet spot for drift is 600 to 750 BHP. Avoid exceeding 800 BHP unless you are very experienced, as it makes the car twitchy and hard to control. Pick an engine with strong mid-range torque rather than peak horsepower. Inline 6 turbos and V8s deliver smooth, controllable power. Aim for roughly equal torque and horsepower figures for the most controllable power delivery.'
  },

  road: {
    name: 'Road Racing',
    overview: 'In FH6, power is the biggest differentiator in road racing. Fill the car with as much horsepower as the PI budget allows, then tune the chassis to control it. You want strong corner exit traction, sharp turn-in, and stable braking. FH6 has more linear steering response and more forgiving braking than previous titles, so builds can be pushed closer to neutral balance. Aero is crucial at higher classes for maintaining grip through fast corners.',

    getTuning: function (cls, dt, weight, bhp, frontDist) {
      var sections = [];
      var wm = weightScale(weight);
      var fd = frontDist || (dt === 'FWD' ? 0.58 : 0.52);

      var frontPsi = dt === 'RWD' ? '32.0' : dt === 'FWD' ? '33.0' : '31.5';
      var rearPsi = dt === 'RWD' ? '31.5' : dt === 'FWD' ? '31.5' : '31.5';
      sections.push({ name: 'Tyres', values: [
        { label: 'Front Tyre Width', value: upgradeLevel(cls, ['Stock', '245mm', '255mm', '275mm']) },
        { label: 'Rear Tyre Width', value: upgradeLevel(cls, ['Stock', '265mm', '285mm', '305mm']) },
        { label: 'Front Pressure', value: frontPsi + ' PSI (semi-slick)' },
        { label: 'Rear Pressure', value: rearPsi + ' PSI (semi-slick)' }
      ], note: 'These pressures are for semi-slick compound. For sport tyres, drop 0.5 PSI each side. For slick, add 0.5 PSI each side. RWD runs higher front pressure for sharper turn-in. FWD runs even higher front pressure to reduce understeer. Widening front tyres is one of the most PI-efficient grip upgrades in FH6.' });

      sections.push({ name: 'Gearing', values: [
        { label: 'Final Drive', value: 'Adjust to suit circuit (see note)' },
        { label: 'Strategy', value: 'Top of last gear should reach the longest straight\'s top speed' }
      ], note: 'For a starting point, use the formula: FD = 4.25 + ((400 - HP) / 6) x 0.01. For engines above 800 HP, halve the HP first. Then adjust so you hit the rev limiter at the end of the longest straight. Shorter gearing gives better acceleration but limits top speed.' });

      sections.push({ name: 'Alignment', values: [
        { label: 'Front Camber', value: '-' + scaleValue(cls, 2.0, 1.0).toFixed(1) },
        { label: 'Rear Camber', value: '-' + scaleValue(cls, 1.5, 0.5).toFixed(1) },
        { label: 'Front Toe', value: '0.0 to 0.1 out' },
        { label: 'Rear Toe', value: '0.0 to 0.1 in' },
        { label: 'Caster', value: (weight > 1600 ? '6.5 to 7.0' : weight > 1200 ? '5.5 to 6.5' : '5.0 to 5.5') }
      ], note: 'Moderate camber compensates for body roll in fast corners to keep the full tyre surface on the road. Too much camber hurts straight-line braking grip. Caster scales with weight: heavier cars benefit from more caster for stability, lighter cars need less to avoid snappy turn-in.' });

      var arbBase = { front: 0, rear: 0 };
      if (dt === 'FWD') { arbBase = { front: 12 * wm, rear: 32 * wm }; }
      else if (dt === 'AWD') { arbBase = { front: 26 * wm, rear: 33 * wm }; }
      else { arbBase = { front: 22 * wm, rear: 30 * wm }; }
      var arbNote = dt === 'FWD'
        ? 'FWD meta uses a very soft front and stiff rear. This fights the natural understeer by promoting rear-end rotation. Adjust the mechanical balance readout towards 0.60.'
        : 'The meta ARB split has the rear stiffer than the front to promote rotation. Use the mechanical balance readout in the tuning menu and aim for 0.55 to 0.65, with 0.60 as the sweet spot.';
      sections.push({ name: 'Anti-Roll Bars', values: [
        { label: 'Front', value: arbBase.front.toFixed(1) },
        { label: 'Rear', value: arbBase.rear.toFixed(1) },
        { label: 'Mech. Balance Target', value: '0.55 to 0.65 (aim 0.60)' }
      ], note: arbNote });

      var rideHz = scaleValue(cls, 2.55, 2.30);
      var springs = calcSprings(weight, fd, rideHz);
      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: springs.front + ' lbs/in' },
        { label: 'Rear Springs', value: springs.rear + ' lbs/in' },
        { label: 'Front Ride Height', value: 'Minimum' },
        { label: 'Rear Ride Height', value: 'Minimum' }
      ], note: 'Springs are calculated from your car\'s weight and distribution, targeting 2.5 Hz for sharp circuit response. Minimum ride height lowers the centre of gravity for maximum grip on smooth tarmac.' });

      var frontRebound = scaleValue(cls, 8.5, 5.5) * wm;
      var rearRebound = frontRebound - 0.3;
      sections.push({ name: 'Damping', values: [
        { label: 'Front Rebound', value: frontRebound.toFixed(1) },
        { label: 'Rear Rebound', value: rearRebound.toFixed(1) },
        { label: 'Front Bump', value: (frontRebound * 0.6).toFixed(1) },
        { label: 'Rear Bump', value: (rearRebound * 0.6).toFixed(1) }
      ], note: 'Bump should be roughly 60% of rebound. Higher rebound keeps the car stable during weight transfer. If the car feels harsh over bumps, reduce bump values slightly.' });

      sections.push({ name: 'Aero', values: [
        { label: 'Front Downforce', value: '40% of total aero (if fitted)' },
        { label: 'Rear Downforce', value: '60% of total aero (if fitted)' },
        { label: 'Aero Balance Target', value: '0.40 to 0.45' }
      ], note: 'The meta aero balance is 0.40 to 0.45, meaning roughly 40% front and 60% rear downforce. This gives a stable, rear-planted car at speed. Check the aero balance readout in the tuning menu and adjust sliders to hit this target. Maximum downforce at both ends is generally fastest for circuits.' });

      var brakeBalance = dt === 'FWD' ? '55% to 60%' : dt === 'AWD' ? '52% to 56%' : '50% to 55%';
      sections.push({ name: 'Brakes', values: [
        { label: 'Brake Balance', value: brakeBalance },
        { label: 'Brake Pressure', value: scaleValue(cls, 100, 90).toFixed(0) + '%' }
      ], note: 'Front-biased brake balance prevents rear lock-up under heavy braking. FWD cars need more front bias as the rear is lighter. If the car spins under braking, move the balance further forward.' });

      if (dt === 'AWD') {
        sections.push({ name: 'Differential', values: [
          { label: 'Front Accel', value: '28%' },
          { label: 'Front Decel', value: '0%' },
          { label: 'Rear Accel', value: '100%' },
          { label: 'Rear Decel', value: '45%' },
          { label: 'Centre Balance', value: '70% to 85% Rear' }
        ], note: 'Meta AWD diff uses maximum rear accel lock with very low front accel to minimise understeer. Zero front decel lets the front wheels steer freely on turn-in. High rear decel stabilises the car under trail braking. A heavily rear-biased centre makes the car feel RWD-like with AWD traction.' });
      } else if (dt === 'FWD') {
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: '60% to 75%' },
          { label: 'Deceleration', value: '10% to 20%' }
        ], note: 'FWD needs strong accel lock to stop the inside wheel spinning on exit and put power down. In the FH6 meta, higher lock means faster exits. If the car pulls or understeers heavily under power, drop 5% at a time.' });
      } else {
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: scaleValue(cls, 95, 75).toFixed(0) + '%' },
          { label: 'Deceleration', value: '20% to 35%' }
        ], note: 'In FH6 power wins, so you need high accel lock to put that power down on corner exit. The 75 to 95% range keeps both rear wheels working together. If the rear pushes wide on tight exits, drop 5% at a time. Higher decel (20 to 35%) lets the car rotate under trail braking for sharper turn-in.' });
      }

      return sections;
    },

    tips: [
      'In FH6, power wins. Maximise horsepower first, then add handling parts to control it. A fast car with average grip beats a slow car with perfect grip.',
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

    getTuning: function (cls, dt, weight, bhp, frontDist) {
      var sections = KNOWLEDGE.road.getTuning(cls, dt, weight, bhp, frontDist);
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

    getTuning: function (cls, dt, weight, bhp, frontDist) {
      var sections = [];
      var wm = weightScale(weight);
      var fd = frontDist || 0.52;

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

      var rallyHz = 2.0;
      var rallySprings = calcSprings(weight, fd, rallyHz);
      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: rallySprings.front + ' lbs/in' },
        { label: 'Rear Springs', value: rallySprings.rear + ' lbs/in' },
        { label: 'Ride Height', value: 'Maximum' }
      ], note: 'Soft springs calculated from your car\'s weight and distribution for compliant off-road suspension. Maximum ride height clears obstacles and prevents bottoming out on jumps.' });

      sections.push({ name: 'Damping', values: [
        { label: 'Front Rebound', value: (6.0 * wm).toFixed(1) + ' to ' + (7.0 * wm).toFixed(1) },
        { label: 'Rear Rebound', value: (6.0 * wm).toFixed(1) + ' to ' + (7.0 * wm).toFixed(1) },
        { label: 'Front Bump', value: (3.6 * wm).toFixed(1) + ' to ' + (4.2 * wm).toFixed(1) },
        { label: 'Rear Bump', value: (3.6 * wm).toFixed(1) + ' to ' + (4.2 * wm).toFixed(1) }
      ], note: 'Bump should be roughly 60% of rebound. Higher rebound than road builds prevents bouncing after jumps. Rally and off-road benefit from slightly more rebound to control body movement on rough terrain.' });

      sections.push({ name: 'Brakes', values: [
        { label: 'Brake Balance', value: '50% to 52%' },
        { label: 'Brake Pressure', value: '90% to 95%' }
      ]});

      if (dt === 'AWD' || dt === 'FWD') {
        sections.push({ name: 'Differential', values: [
          { label: 'Front Accel', value: '30% to 40%' },
          { label: 'Front Decel', value: '0% to 15%' },
          { label: 'Rear Accel', value: '70% to 85%' },
          { label: 'Rear Decel', value: '20% to 30%' },
          { label: 'Centre Balance', value: '65% to 75% Rear' }
        ], note: 'Power-first meta means you need strong rear lock to put that power down on loose surfaces. High rear accel keeps both wheels driving together on exit. If the car pushes wide on slippery corners, drop rear accel 5% at a time. Rear decel helps control the car on loose descents.' });
      } else {
        sections.push({ name: 'Differential', values: [
          { label: 'Acceleration', value: '60% to 75%' },
          { label: 'Deceleration', value: '15% to 25%' }
        ], note: 'RWD off-road needs strong accel lock to put power down on loose surfaces. If the car pushes wide on slippery exits, drop 5% at a time.' });
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

    getTuning: function (cls, dt, weight, bhp, frontDist) {
      var sections = KNOWLEDGE.offroad.getTuning(cls, dt, weight, bhp, frontDist);
      var wm = weightScale(weight);
      var fd = frontDist || 0.52;
      sections.forEach(function (sec) {
        if (sec.name === 'Springs') {
          var ccHz = 2.15;
          var ccSprings = calcSprings(weight, fd, ccHz);
          sec.values = [
            { label: 'Front Springs', value: ccSprings.front + ' lbs/in' },
            { label: 'Rear Springs', value: ccSprings.rear + ' lbs/in' },
            { label: 'Ride Height', value: 'Maximum or near maximum' }
          ];
          sec.note = 'Slightly stiffer springs than pure off-road for the faster tarmac sections. Still soft enough for rough terrain.';
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
            { label: 'Front Accel', value: '35% to 50%' },
            { label: 'Front Decel', value: '5% to 15%' },
            { label: 'Rear Accel', value: '75% to 90%' },
            { label: 'Rear Decel', value: '20% to 30%' },
            { label: 'Centre Balance', value: '60% to 70% Rear' }
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

    getTuning: function (cls, dt, weight, bhp, frontDist) {
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

      var dragHz = 2.65;
      var dragSprings = calcSprings(weight || 1400, 0.50, dragHz);
      var softFront = Math.round(dragSprings.front * 0.5);
      sections.push({ name: 'Springs', values: [
        { label: 'Front Springs', value: softFront + ' lbs/in (soft)' },
        { label: 'Rear Springs', value: dragSprings.rear + ' lbs/in (stiff)' },
        { label: 'Front Ride Height', value: 'Maximum' },
        { label: 'Rear Ride Height', value: 'Minimum' }
      ], note: 'Stiff rear springs support weight transfer on launch. The front is halved to let weight shift rearward. A raked stance (front high, rear low) promotes maximum traction off the line.' });

      sections.push({ name: 'Damping', values: [
        { label: 'Front Rebound', value: '4.0 to 5.0' },
        { label: 'Rear Rebound', value: '8.0 to 10.0' },
        { label: 'Front Bump', value: '2.5 to 3.0' },
        { label: 'Rear Bump', value: '5.0 to 6.0' }
      ], note: 'Stiff rear damping resists squat and keeps the rear planted under hard acceleration. Soft front allows weight to transfer rearward on launch. Bump is roughly 60% of rebound.' });

      sections.push({ name: 'Aero', values: [
        { label: 'Front Downforce', value: 'Remove front aero if possible' },
        { label: 'Rear Downforce', value: 'Minimum or remove (add rear wing only if wheelspin is severe)' }
      ], note: 'Less downforce means less aerodynamic drag and higher top speed. Only add a rear wing if you cannot control wheelspin through gearing and differential alone. Front aero adds drag with no benefit in a straight line.' });

      sections.push({ name: 'Brakes', values: [
        { label: 'Brake Balance', value: '50%' },
        { label: 'Brake Pressure', value: '100%' }
      ], note: 'Brakes are rarely used in drag racing, but balanced pressure helps if you need to stop at the end of a strip.' });

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
