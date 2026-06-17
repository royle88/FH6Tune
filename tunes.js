var TUNES = {

  drift: {
    description: 'A drift build focuses on rear-wheel power delivery, angle, and sustained slides. We prioritise throttle control, weight transfer, and keeping the rear end loose while maintaining enough grip to link corners.',

    upgrades: function (cls, dt) {
      var base = {
        'Engine': [
          { part: 'Intake', level: cls === 'S2' || cls === 'R' ? 'Race' : 'Sport' },
          { part: 'Exhaust', level: cls === 'S2' || cls === 'R' ? 'Race' : 'Sport' },
          { part: 'Ignition', level: cls === 'S2' || cls === 'R' ? 'Race' : 'Sport' },
          { part: 'Camshaft', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Valves', level: highClass(cls) ? 'Race' : 'Street' },
          { part: 'Fuel System', level: highClass(cls) ? 'Race' : 'Sport' }
        ],
        'Aspiration': [
          { part: 'Turbo / Supercharger', level: highClass(cls) ? 'Twin Turbo or Large Single Turbo' : 'Single Turbo (if available)' },
          { part: 'Intercooler', level: highClass(cls) ? 'Race' : 'Sport' }
        ],
        'Platform and Handling': [
          { part: 'Brakes', level: 'Sport' },
          { part: 'Springs and Dampers', level: 'Race' },
          { part: 'Anti-Roll Bars', level: 'Race' },
          { part: 'Roll Cage', level: highClass(cls) ? 'Race' : 'Street' },
          { part: 'Weight Reduction', level: cls === 'R' ? 'Race' : (highClass(cls) ? 'Sport' : 'Street') },
          { part: 'Chassis Stiffening', level: 'Race' }
        ],
        'Drivetrain': [
          { part: 'Clutch', level: 'Race' },
          { part: 'Transmission', level: 'Race' },
          { part: 'Driveline', level: 'Race' },
          { part: 'Differential', level: 'Race' }
        ],
        'Tyres and Rims': [
          { part: 'Tyre Compound', level: 'Drift Tyres' },
          { part: 'Front Tyre Width', level: 'Near maximum' },
          { part: 'Rear Tyre Width', level: 'Maximum' },
          { part: 'Rim Style', level: 'Lightest available (or style preference)' }
        ],
        'Aero': [
          { part: 'Front Bumper', level: 'Forza Aero or style choice with downforce' },
          { part: 'Rear Wing', level: 'Forza Aero (adjustable)' }
        ]
      };

      if (dt === 'AWD') {
        base['Conversion'] = [
          { part: 'Drivetrain Swap', level: 'Consider swapping to RWD for a purer drift feel' }
        ];
      }

      return base;
    },

    tuning: function (cls, dt) {
      var s = classScale(cls);
      return {
        'Tyres': {
          values: [
            { label: 'Front Pressure', f: '29.0 PSI' },
            { label: 'Rear Pressure', f: '39.0 - 41.0 PSI' }
          ],
          note: 'High rear pressure reduces the rear contact patch, making it easier to break traction and sustain slides. Low front pressure keeps the front tyres planted for steering control at full lock.'
        },
        'Gearing': {
          values: [
            { label: 'Final Drive', f: '3.80 (adjust to taste)' },
            { label: '1st Gear', f: '3.20 - 3.50' },
            { label: '2nd Gear', f: '2.00 - 2.30' },
            { label: '3rd Gear', f: '1.50 - 1.70' },
            { label: '4th Gear', f: '1.15 - 1.30' },
            { label: '5th Gear', f: '0.95 - 1.05' },
            { label: '6th Gear', f: '0.80 - 0.90' }
          ],
          note: 'Keep gears close together so you stay in the power band during transitions. Most drifting happens in 2nd and 3rd gear. Shorten these if you need quicker response.'
        },
        'Alignment': {
          values: [
            { label: 'Front Camber', f: '-4.5 to -5.0' },
            { label: 'Rear Camber', f: '-0.5 to -1.0' },
            { label: 'Front Toe', f: '0.3 out' },
            { label: 'Rear Toe', f: '0.1 to 0.2 in' },
            { label: 'Caster', f: 'Max (~7.0)' }
          ],
          note: 'Aggressive front camber keeps the front tyres planted at full steering lock. Minimal rear camber maximises the rear contact patch for controlled slides. Front toe-out sharpens initial turn-in. Rear toe-in stabilises the rear during transitions. Maximum caster gives strong self-steer effect for maintaining angle.'
        },
        'Anti-Roll Bars': {
          values: [
            { label: 'Front', f: '25.0 - 30.0' },
            { label: 'Rear', f: '8.0 - 12.0' }
          ],
          note: 'A stiff front ARB with a soft rear ARB promotes oversteer and makes it easier to initiate drifts. If the car snaps too aggressively, soften the front slightly.'
        },
        'Springs': {
          values: [
            { label: 'Front Springs', f: (60 + s * 15).toFixed(1) + ' kgf/mm' },
            { label: 'Rear Springs', f: (48 + s * 10).toFixed(1) + ' kgf/mm' },
            { label: 'Front Ride Height', f: '10.0 - 11.0 cm' },
            { label: 'Rear Ride Height', f: '10.5 - 11.5 cm' }
          ],
          note: 'Stiffer front springs help with turn-in responsiveness. Slightly higher rear ride height shifts weight to the front, aiding initiation.'
        },
        'Damping': {
          values: [
            { label: 'Front Rebound', f: '8.0' },
            { label: 'Rear Rebound', f: '6.5' },
            { label: 'Front Bump', f: '3.0' },
            { label: 'Rear Bump', f: '2.5' }
          ],
          note: 'Softer bump settings let the suspension absorb weight transfer smoothly during transitions. Higher front rebound keeps the front end responsive.'
        },
        'Aero': {
          values: [
            { label: 'Front Downforce', f: (120 + s * 30).toFixed(0) },
            { label: 'Rear Downforce', f: (150 + s * 30).toFixed(0) }
          ],
          note: 'Moderate downforce helps control at speed. More rear downforce than front keeps the car stable during high-speed drifts without killing angle at low speed.'
        },
        'Brakes': {
          values: [
            { label: 'Brake Pressure', f: '100%' },
            { label: 'Brake Balance', f: '48 - 50% rear' }
          ],
          note: 'A rear-biased brake balance helps rotate the car on entry. This lets you use braking to initiate drifts.'
        },
        'Differential': getDiffTune(dt, 'drift', s)
      };
    },

    tips: [
      'If you are spinning on entry, lower the decel lock by 5-10% and soften the front ARB.',
      'If you are losing angle mid-drift, raise accel lock towards 90% and drop rear tyre pressure by 1 PSI.',
      'If there is turbo lag during transitions, shorten 2nd and 3rd gear to keep revs high.',
      'If the car understeers on entry, raise the front ARB, stiffen the front spring, or raise rear ride height by 0.5 cm.'
    ]
  },

  road: {
    description: 'A road racing build prioritises balanced grip, corner speed, and braking stability. The goal is a neutral-handling car that turns in sharply and puts power down cleanly on exit.',

    upgrades: function (cls, dt) {
      return {
        'Engine': [
          { part: 'Intake', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Exhaust', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Ignition', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Camshaft', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Valves', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Fuel System', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Oil and Cooling', level: 'Race' }
        ],
        'Aspiration': [
          { part: 'Turbo / Supercharger', level: highClass(cls) ? 'Race Turbo' : 'Sport Turbo (if needed for PI)' },
          { part: 'Intercooler', level: highClass(cls) ? 'Race' : 'Sport' }
        ],
        'Platform and Handling': [
          { part: 'Brakes', level: 'Race' },
          { part: 'Springs and Dampers', level: 'Race' },
          { part: 'Anti-Roll Bars', level: 'Race' },
          { part: 'Roll Cage', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Weight Reduction', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Chassis Stiffening', level: 'Race' }
        ],
        'Drivetrain': [
          { part: 'Clutch', level: 'Race' },
          { part: 'Transmission', level: 'Race' },
          { part: 'Driveline', level: 'Race' },
          { part: 'Differential', level: 'Race' }
        ],
        'Tyres and Rims': [
          { part: 'Tyre Compound', level: highClass(cls) ? 'Slick' : 'Semi-Slick' },
          { part: 'Front Tyre Width', level: 'Maximum' },
          { part: 'Rear Tyre Width', level: 'Maximum' },
          { part: 'Rim Style', level: 'Lightest available' }
        ],
        'Aero': [
          { part: 'Front Bumper', level: 'Forza Aero (adjustable)' },
          { part: 'Rear Wing', level: 'Forza Aero (adjustable)' }
        ]
      };
    },

    tuning: function (cls, dt) {
      var s = classScale(cls);
      var rwd = dt === 'RWD';
      return {
        'Tyres': {
          values: [
            { label: 'Front Pressure', f: (30.0 + s * 1.0).toFixed(1) + ' PSI' },
            { label: 'Rear Pressure', f: (30.0 + s * 1.0).toFixed(1) + ' PSI' }
          ],
          note: 'Start with equal pressures and adjust from there. If the rear slides too much, drop rear pressure by 0.5 to 1.0 PSI. If the front washes out, drop front pressure.'
        },
        'Gearing': {
          values: [
            { label: 'Final Drive', f: '3.20 - 3.80' },
            { label: '1st Gear', f: '3.00 - 3.30' },
            { label: '2nd Gear', f: '2.00 - 2.20' },
            { label: '3rd Gear', f: '1.50 - 1.65' },
            { label: '4th Gear', f: '1.20 - 1.35' },
            { label: '5th Gear', f: '1.00 - 1.10' },
            { label: '6th Gear', f: '0.85 - 0.95' }
          ],
          note: 'For circuit racing, spread the gears a bit wider than a drift tune. You want 6th gear to reach near top speed on the longest straight of your target track.'
        },
        'Alignment': {
          values: [
            { label: 'Front Camber', f: '-1.0 to -1.5' },
            { label: 'Rear Camber', f: '-0.5 to -1.0' },
            { label: 'Front Toe', f: '0.0 to 0.1 out' },
            { label: 'Rear Toe', f: '0.0' },
            { label: 'Caster', f: '5.0 - 5.5' }
          ],
          note: 'Less camber than a drift tune. You want maximum tyre contact patch under braking and acceleration. Slight front toe-out improves turn-in.'
        },
        'Anti-Roll Bars': {
          values: [
            { label: 'Front', f: rwd ? (25 + s * 5).toFixed(1) : (20 + s * 5).toFixed(1) },
            { label: 'Rear', f: rwd ? (20 + s * 5).toFixed(1) : (25 + s * 5).toFixed(1) }
          ],
          note: rwd
            ? 'For RWD, run the front slightly stiffer than the rear to keep the rear planted on power. Adjust if you feel understeer.'
            : (dt === 'AWD'
              ? 'For AWD, a slightly stiffer rear helps rotate the car. The AWD system provides natural stability, so you can afford a bit more rear stiffness.'
              : 'For FWD, run the rear stiffer than the front to help the car rotate and reduce understeer.')
        },
        'Springs': {
          values: [
            { label: 'Front Springs', f: (55 + s * 15).toFixed(1) + ' kgf/mm' },
            { label: 'Rear Springs', f: (50 + s * 12).toFixed(1) + ' kgf/mm' },
            { label: 'Front Ride Height', f: 'Minimum' },
            { label: 'Rear Ride Height', f: 'Minimum' }
          ],
          note: 'Lower ride height gives a lower centre of gravity and more stability. Stiffer springs reduce body roll. Front should be slightly stiffer than rear for most setups.'
        },
        'Damping': {
          values: [
            { label: 'Front Rebound', f: (8.0 + s * 1.5).toFixed(1) },
            { label: 'Rear Rebound', f: (7.0 + s * 1.5).toFixed(1) },
            { label: 'Front Bump', f: (4.5 + s * 1.0).toFixed(1) },
            { label: 'Rear Bump', f: (4.0 + s * 1.0).toFixed(1) }
          ],
          note: 'Rebound should be roughly 60% of spring rate, bump roughly 40%. If the car bounces over kerbs, soften the bump damping.'
        },
        'Aero': {
          values: [
            { label: 'Front Downforce', f: (100 + s * 40).toFixed(0) },
            { label: 'Rear Downforce', f: (120 + s * 40).toFixed(0) }
          ],
          note: 'More downforce means more grip but lower top speed. For technical tracks, run higher downforce. For fast tracks with long straights, back it off.'
        },
        'Brakes': {
          values: [
            { label: 'Brake Pressure', f: '90 - 100%' },
            { label: 'Brake Balance', f: '55% front / 45% rear' }
          ],
          note: 'Front-biased braking keeps the car stable under hard braking. If the rear steps out under brakes, move more balance to the front.'
        },
        'Differential': getDiffTune(dt, 'road', s)
      };
    },

    tips: [
      'If the car understeers, soften the front ARB, stiffen the rear ARB, or add more front downforce.',
      'If the rear steps out under power, lower the accel lock on the rear diff and soften the rear ARB.',
      'If the car bounces over bumps, soften the bump damping on both axles.',
      'If you run out of top speed, lower the final drive ratio or reduce aero.'
    ]
  },

  street: {
    description: 'Street racing builds need to handle mixed surfaces, traffic, and unpredictable corners. The focus is on a forgiving, stable car that can recover from mistakes at speed.',

    upgrades: function (cls, dt) {
      return {
        'Engine': [
          { part: 'Intake', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Exhaust', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Ignition', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Camshaft', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Fuel System', level: highClass(cls) ? 'Race' : 'Sport' }
        ],
        'Platform and Handling': [
          { part: 'Brakes', level: 'Sport' },
          { part: 'Springs and Dampers', level: 'Race' },
          { part: 'Anti-Roll Bars', level: 'Race' },
          { part: 'Weight Reduction', level: highClass(cls) ? 'Sport' : 'Street' },
          { part: 'Chassis Stiffening', level: 'Sport' }
        ],
        'Drivetrain': [
          { part: 'Clutch', level: 'Sport' },
          { part: 'Transmission', level: 'Race' },
          { part: 'Driveline', level: 'Race' },
          { part: 'Differential', level: 'Race' }
        ],
        'Tyres and Rims': [
          { part: 'Tyre Compound', level: 'Sport or Semi-Slick' },
          { part: 'Front Tyre Width', level: 'Near maximum' },
          { part: 'Rear Tyre Width', level: 'Maximum' }
        ],
        'Aero': [
          { part: 'Front Bumper', level: 'Forza Aero if PI allows, otherwise stock' },
          { part: 'Rear Wing', level: 'Forza Aero if PI allows, otherwise stock' }
        ]
      };
    },

    tuning: function (cls, dt) {
      var s = classScale(cls);
      return {
        'Tyres': {
          values: [
            { label: 'Front Pressure', f: (29.0 + s * 1.0).toFixed(1) + ' PSI' },
            { label: 'Rear Pressure', f: (29.0 + s * 1.0).toFixed(1) + ' PSI' }
          ],
          note: 'Equal pressures give a balanced feel. Street races have mixed conditions, so a neutral setup is safest.'
        },
        'Gearing': {
          values: [
            { label: 'Final Drive', f: '3.40 - 3.90' },
            { label: '1st - 6th', f: 'Spread evenly for a broad power band' }
          ],
          note: 'Street racing benefits from a wider gear spread than circuit racing. You need good acceleration out of tight corners but also enough top speed for long straights between checkpoints.'
        },
        'Alignment': {
          values: [
            { label: 'Front Camber', f: '-1.0 to -1.5' },
            { label: 'Rear Camber', f: '-0.5 to -1.0' },
            { label: 'Front Toe', f: '0.0' },
            { label: 'Rear Toe', f: '0.0' },
            { label: 'Caster', f: '5.0' }
          ],
          note: 'Keep alignment conservative for predictable handling in traffic.'
        },
        'Anti-Roll Bars': {
          values: [
            { label: 'Front', f: (22 + s * 5).toFixed(1) },
            { label: 'Rear', f: (20 + s * 5).toFixed(1) }
          ],
          note: 'Slightly softer than a circuit tune. You need the car to absorb road imperfections and stay composed when you clip a kerb or verge.'
        },
        'Springs': {
          values: [
            { label: 'Front Springs', f: (50 + s * 12).toFixed(1) + ' kgf/mm' },
            { label: 'Rear Springs', f: (45 + s * 10).toFixed(1) + ' kgf/mm' },
            { label: 'Front Ride Height', f: 'Near minimum' },
            { label: 'Rear Ride Height', f: 'Near minimum' }
          ],
          note: 'Not quite as low as a circuit car. Streets can have bumps and dips that bottom out a slammed ride height.'
        },
        'Damping': {
          values: [
            { label: 'Front Rebound', f: (7.5 + s * 1.5).toFixed(1) },
            { label: 'Rear Rebound', f: (6.5 + s * 1.5).toFixed(1) },
            { label: 'Front Bump', f: (4.0 + s * 1.0).toFixed(1) },
            { label: 'Rear Bump', f: (3.5 + s * 1.0).toFixed(1) }
          ],
          note: 'Slightly softer damping than a circuit tune to handle rough street surfaces.'
        },
        'Aero': {
          values: [
            { label: 'Front Downforce', f: 'Mid-range (if fitted)' },
            { label: 'Rear Downforce', f: 'Mid-range (if fitted)' }
          ],
          note: 'Moderate aero is fine. Top speed matters on streets, so do not go maximum downforce.'
        },
        'Brakes': {
          values: [
            { label: 'Brake Pressure', f: '95 - 105%' },
            { label: 'Brake Balance', f: '52% front / 48% rear' }
          ],
          note: 'A more neutral brake balance suits the unpredictable nature of street racing. You need confidence under late braking.'
        },
        'Differential': getDiffTune(dt, 'road', s)
      };
    },

    tips: [
      'Street races are won on corner exit speed and late braking. Prioritise traction over outright grip.',
      'If you keep hitting walls, soften the front springs and add a touch of understeer with ARB tuning.',
      'AWD swaps are very strong in street racing due to the better traction out of tight corners.'
    ]
  },

  offroad: {
    description: 'Off-road builds need suspension travel, soft springs, and tyres that grip on dirt, mud, and gravel. The car needs to absorb jumps and rough terrain without losing control.',

    upgrades: function (cls, dt) {
      return {
        'Engine': [
          { part: 'Intake', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Exhaust', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Camshaft', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Fuel System', level: highClass(cls) ? 'Race' : 'Sport' }
        ],
        'Platform and Handling': [
          { part: 'Brakes', level: 'Sport' },
          { part: 'Springs and Dampers', level: 'Rally' },
          { part: 'Anti-Roll Bars', level: 'Race' },
          { part: 'Weight Reduction', level: highClass(cls) ? 'Sport' : 'Street' },
          { part: 'Chassis Stiffening', level: 'Sport' }
        ],
        'Drivetrain': [
          { part: 'Clutch', level: 'Race' },
          { part: 'Transmission', level: 'Race' },
          { part: 'Driveline', level: 'Race' },
          { part: 'Differential', level: 'Race' }
        ],
        'Tyres and Rims': [
          { part: 'Tyre Compound', level: 'Off-Road' },
          { part: 'Front Tyre Width', level: 'Maximum' },
          { part: 'Rear Tyre Width', level: 'Maximum' }
        ],
        'Aero': [
          { part: 'Front Bumper', level: 'Stock or off-road bumper' },
          { part: 'Rear Wing', level: 'Stock or remove (aero is less effective off-road)' }
        ],
        'Conversion': [
          { part: 'Drivetrain Swap', level: dt === 'RWD' || dt === 'FWD' ? 'Strongly consider AWD swap for traction' : 'AWD is ideal, keep it' }
        ]
      };
    },

    tuning: function (cls, dt) {
      var s = classScale(cls);
      return {
        'Tyres': {
          values: [
            { label: 'Front Pressure', f: '24.0 - 26.0 PSI' },
            { label: 'Rear Pressure', f: '24.0 - 26.0 PSI' }
          ],
          note: 'Low pressures give more grip on loose surfaces. This is the opposite of road racing where higher pressures are often better.'
        },
        'Gearing': {
          values: [
            { label: 'Final Drive', f: '3.50 - 4.00' },
            { label: '1st - 6th', f: 'Close ratio for quick acceleration' }
          ],
          note: 'Off-road benefits from shorter gearing. You rarely reach top speed, so prioritise acceleration and staying in the power band over rough terrain.'
        },
        'Alignment': {
          values: [
            { label: 'Front Camber', f: '-0.5 to -1.0' },
            { label: 'Rear Camber', f: '-0.5' },
            { label: 'Front Toe', f: '0.0' },
            { label: 'Rear Toe', f: '0.0' },
            { label: 'Caster', f: '4.0 - 5.0' }
          ],
          note: 'Minimal camber off-road. You need a flat tyre contact patch for grip on loose surfaces, not the angled contact of a circuit car.'
        },
        'Anti-Roll Bars': {
          values: [
            { label: 'Front', f: (10 + s * 5).toFixed(1) },
            { label: 'Rear', f: (8 + s * 4).toFixed(1) }
          ],
          note: 'Soft ARBs let the suspension work independently over bumps. This is crucial for keeping all four tyres on the ground on rough terrain.'
        },
        'Springs': {
          values: [
            { label: 'Front Springs', f: (30 + s * 8).toFixed(1) + ' kgf/mm' },
            { label: 'Rear Springs', f: (28 + s * 6).toFixed(1) + ' kgf/mm' },
            { label: 'Front Ride Height', f: 'Maximum' },
            { label: 'Rear Ride Height', f: 'Maximum' }
          ],
          note: 'Soft springs and maximum ride height give the most suspension travel. This prevents bottoming out over jumps and rough terrain.'
        },
        'Damping': {
          values: [
            { label: 'Front Rebound', f: (5.0 + s * 1.0).toFixed(1) },
            { label: 'Rear Rebound', f: (4.5 + s * 1.0).toFixed(1) },
            { label: 'Front Bump', f: (3.0 + s * 0.5).toFixed(1) },
            { label: 'Rear Bump', f: (2.5 + s * 0.5).toFixed(1) }
          ],
          note: 'Soft damping absorbs impacts. If the car bounces too much after jumps, stiffen the rebound slightly.'
        },
        'Aero': {
          values: [
            { label: 'Front Downforce', f: 'Not applicable (remove if possible)' },
            { label: 'Rear Downforce', f: 'Not applicable (remove if possible)' }
          ],
          note: 'Aero is largely ineffective at off-road speeds and on loose surfaces. Save the PI for other upgrades.'
        },
        'Brakes': {
          values: [
            { label: 'Brake Pressure', f: '80 - 95%' },
            { label: 'Brake Balance', f: '50% front / 50% rear' }
          ],
          note: 'Lower brake pressure prevents locking up on loose surfaces. Neutral balance keeps the car predictable.'
        },
        'Differential': getDiffTune(dt, 'offroad', s)
      };
    },

    tips: [
      'AWD is king off-road. If your car is RWD or FWD, an AWD swap will make a massive difference.',
      'If the car bottoms out over jumps, raise the ride height and soften the springs further.',
      'If you are sliding too much on dirt corners, lower tyre pressure and soften the rear ARB.',
      'Rally springs are a better PI spend than race springs for off-road. Use them if available.'
    ]
  },

  'cross-country': {
    description: 'Cross country mixes road and off-road sections. You need a car that handles tarmac corners but can also survive dirt, grass, and jumps. Think of it as a rally build with a bit more road composure.',

    upgrades: function (cls, dt) {
      return {
        'Engine': [
          { part: 'Intake', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Exhaust', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Camshaft', level: highClass(cls) ? 'Race' : 'Sport' },
          { part: 'Fuel System', level: highClass(cls) ? 'Race' : 'Sport' }
        ],
        'Platform and Handling': [
          { part: 'Brakes', level: 'Sport' },
          { part: 'Springs and Dampers', level: 'Rally' },
          { part: 'Anti-Roll Bars', level: 'Race' },
          { part: 'Weight Reduction', level: highClass(cls) ? 'Sport' : 'Street' },
          { part: 'Chassis Stiffening', level: 'Sport' }
        ],
        'Drivetrain': [
          { part: 'Clutch', level: 'Race' },
          { part: 'Transmission', level: 'Race' },
          { part: 'Driveline', level: 'Race' },
          { part: 'Differential', level: 'Race' }
        ],
        'Tyres and Rims': [
          { part: 'Tyre Compound', level: 'Rally' },
          { part: 'Front Tyre Width', level: 'Maximum' },
          { part: 'Rear Tyre Width', level: 'Maximum' }
        ],
        'Aero': [
          { part: 'Front Bumper', level: 'Stock or Rally bumper' },
          { part: 'Rear Wing', level: 'Forza Aero if PI allows' }
        ],
        'Conversion': [
          { part: 'Drivetrain Swap', level: dt === 'RWD' || dt === 'FWD' ? 'Consider AWD swap for mixed surfaces' : 'AWD is ideal, keep it' }
        ]
      };
    },

    tuning: function (cls, dt) {
      var s = classScale(cls);
      return {
        'Tyres': {
          values: [
            { label: 'Front Pressure', f: '25.0 - 27.0 PSI' },
            { label: 'Rear Pressure', f: '25.0 - 27.0 PSI' }
          ],
          note: 'A middle ground between road and off-road pressures. Slightly lower than road racing for the loose surface sections.'
        },
        'Gearing': {
          values: [
            { label: 'Final Drive', f: '3.40 - 3.80' },
            { label: '1st - 6th', f: 'Moderate spread for mixed terrain' }
          ],
          note: 'You need decent acceleration for the off-road sections but enough top speed for the tarmac straights.'
        },
        'Alignment': {
          values: [
            { label: 'Front Camber', f: '-0.5 to -1.0' },
            { label: 'Rear Camber', f: '-0.5' },
            { label: 'Front Toe', f: '0.0' },
            { label: 'Rear Toe', f: '0.0' },
            { label: 'Caster', f: '4.5 - 5.0' }
          ],
          note: 'Keep it conservative. Minimal camber works well on mixed surfaces.'
        },
        'Anti-Roll Bars': {
          values: [
            { label: 'Front', f: (15 + s * 5).toFixed(1) },
            { label: 'Rear', f: (12 + s * 4).toFixed(1) }
          ],
          note: 'Softer than road racing but slightly stiffer than pure off-road. This gives decent cornering on tarmac while absorbing bumps off-road.'
        },
        'Springs': {
          values: [
            { label: 'Front Springs', f: (40 + s * 10).toFixed(1) + ' kgf/mm' },
            { label: 'Rear Springs', f: (36 + s * 8).toFixed(1) + ' kgf/mm' },
            { label: 'Front Ride Height', f: 'High (not quite maximum)' },
            { label: 'Rear Ride Height', f: 'High (not quite maximum)' }
          ],
          note: 'Softer and higher than a road car, but not as extreme as a pure off-road build. You still need some body control for the tarmac sections.'
        },
        'Damping': {
          values: [
            { label: 'Front Rebound', f: (6.0 + s * 1.0).toFixed(1) },
            { label: 'Rear Rebound', f: (5.5 + s * 1.0).toFixed(1) },
            { label: 'Front Bump', f: (3.5 + s * 0.5).toFixed(1) },
            { label: 'Rear Bump', f: (3.0 + s * 0.5).toFixed(1) }
          ],
          note: 'Soft enough to handle rough terrain, firm enough to stay composed on road. A good middle ground.'
        },
        'Aero': {
          values: [
            { label: 'Front Downforce', f: 'Low to mid-range (if fitted)' },
            { label: 'Rear Downforce', f: 'Low to mid-range (if fitted)' }
          ],
          note: 'Some aero can help on the tarmac sections, but it is less effective off-road. Do not go heavy on downforce.'
        },
        'Brakes': {
          values: [
            { label: 'Brake Pressure', f: '85 - 100%' },
            { label: 'Brake Balance', f: '50% front / 50% rear' }
          ],
          note: 'Neutral balance and moderate pressure. You need to brake on both tarmac and loose surfaces without locking up.'
        },
        'Differential': getDiffTune(dt, 'offroad', s)
      };
    },

    tips: [
      'Rally tyres are the best all-round choice for cross country. They grip on both tarmac and dirt.',
      'If the car feels unstable on road sections, stiffen the ARBs slightly and lower the ride height a touch.',
      'If you are bottoming out on jumps, raise the ride height and soften the springs.',
      'AWD is strongly recommended for cross country. The mixed surfaces punish RWD and FWD.'
    ]
  },

  drag: {
    description: 'Drag builds are all about straight-line speed and launch traction. Handling is secondary. Maximum power, maximum grip off the line, and the right gearing to hit top speed by the finish.',

    upgrades: function (cls, dt) {
      return {
        'Engine': [
          { part: 'Intake', level: 'Race' },
          { part: 'Exhaust', level: 'Race' },
          { part: 'Ignition', level: 'Race' },
          { part: 'Camshaft', level: 'Race' },
          { part: 'Valves', level: 'Race' },
          { part: 'Fuel System', level: 'Race' },
          { part: 'Oil and Cooling', level: 'Race' },
          { part: 'Flywheel', level: 'Race (lightest)' }
        ],
        'Aspiration': [
          { part: 'Turbo / Supercharger', level: 'Largest available (twin turbo if possible)' },
          { part: 'Intercooler', level: 'Race' }
        ],
        'Platform and Handling': [
          { part: 'Brakes', level: 'Stock (save PI for power)' },
          { part: 'Springs and Dampers', level: 'Race' },
          { part: 'Anti-Roll Bars', level: 'Race' },
          { part: 'Weight Reduction', level: 'Race' }
        ],
        'Drivetrain': [
          { part: 'Clutch', level: 'Race' },
          { part: 'Transmission', level: 'Race' },
          { part: 'Driveline', level: 'Race' },
          { part: 'Differential', level: 'Race' }
        ],
        'Tyres and Rims': [
          { part: 'Tyre Compound', level: 'Drag Tyres (if available) or Slick' },
          { part: 'Rear Tyre Width', level: 'Maximum' },
          { part: 'Front Tyre Width', level: 'Narrow (reduce rolling resistance)' }
        ],
        'Aero': [
          { part: 'Front Bumper', level: 'Remove or stock (reduce drag)' },
          { part: 'Rear Wing', level: 'Remove (reduce drag)' }
        ],
        'Conversion': dt === 'FWD'
          ? [{ part: 'Drivetrain Swap', level: 'AWD or RWD swap recommended for drag' }]
          : []
      };
    },

    tuning: function (cls, dt) {
      var s = classScale(cls);
      var isAWD = dt === 'AWD';
      return {
        'Tyres': {
          values: [
            { label: 'Front Pressure', f: '35.0 - 40.0 PSI' },
            { label: 'Rear Pressure', f: isAWD ? '28.0 - 30.0 PSI' : '26.0 - 28.0 PSI' }
          ],
          note: 'High front pressure reduces rolling resistance (you are not cornering). Low rear pressure maximises the contact patch for launch traction.'
        },
        'Gearing': {
          values: [
            { label: 'Final Drive', f: 'Tune to hit top speed at the finish line' },
            { label: 'Strategy', f: 'Short 1st for launch, then stretch upper gears' }
          ],
          note: 'The goal is to hit redline in your top gear right at the finish. If you top out early, lengthen the final drive. If you do not reach top speed, shorten it. This takes trial and error.'
        },
        'Alignment': {
          values: [
            { label: 'Front Camber', f: '0.0' },
            { label: 'Rear Camber', f: '0.0' },
            { label: 'Front Toe', f: '0.0' },
            { label: 'Rear Toe', f: '0.0' },
            { label: 'Caster', f: '5.0' }
          ],
          note: 'Zero camber and toe everywhere. You are going in a straight line, so you want maximum tyre contact patch and zero scrub.'
        },
        'Anti-Roll Bars': {
          values: [
            { label: 'Front', f: '1.0 (minimum)' },
            { label: 'Rear', f: '1.0 (minimum)' }
          ],
          note: 'ARBs do not matter in a straight line. Set them to minimum to save any handling oddity on launch.'
        },
        'Springs': {
          values: [
            { label: 'Front Springs', f: 'Stiff (weight transfer to rear)' },
            { label: 'Rear Springs', f: 'Soft (absorb launch squat)' },
            { label: 'Front Ride Height', f: 'Minimum' },
            { label: 'Rear Ride Height', f: 'Minimum' }
          ],
          note: 'Stiff front and soft rear springs transfer weight to the rear tyres on launch, improving traction. Low ride height reduces aerodynamic drag.'
        },
        'Damping': {
          values: [
            { label: 'Front Rebound', f: 'Maximum' },
            { label: 'Rear Rebound', f: 'Soft' },
            { label: 'Front Bump', f: 'Maximum' },
            { label: 'Rear Bump', f: 'Soft' }
          ],
          note: 'This exaggerates the weight transfer to the rear on launch. The front stays planted and the rear squats for traction.'
        },
        'Aero': {
          values: [
            { label: 'Front Downforce', f: 'Minimum or remove' },
            { label: 'Rear Downforce', f: 'Minimum or remove' }
          ],
          note: 'Downforce creates drag and costs you top speed. In drag racing, speed is everything. Remove all aero if possible.'
        },
        'Brakes': {
          values: [
            { label: 'Brake Pressure', f: '100%' },
            { label: 'Brake Balance', f: '50% front / 50% rear' }
          ],
          note: 'Brakes are not critical in drag racing but keep them balanced in case you need to stop.'
        },
        'Differential': getDiffTune(dt, 'drag', s)
      };
    },

    tips: [
      'Launch control is everything. Practice your launch timing to avoid wheelspin.',
      'If you get too much wheelspin on launch, lower the rear diff accel lock or soften the rear springs.',
      'AWD is often faster off the line than RWD due to better traction. Consider an AWD swap.',
      'Engine swaps can be the single biggest PI-efficient upgrade for drag builds.'
    ]
  }
};

// Helpers

function highClass(cls) {
  return cls === 'S1' || cls === 'S2' || cls === 'R';
}

function classScale(cls) {
  var scales = { D: 0, C: 0.15, B: 0.3, A: 0.5, S1: 0.7, S2: 0.85, R: 1.0 };
  return scales[cls] || 0.5;
}

function getDiffTune(dt, style, s) {
  var result = { values: [], note: '' };

  if (style === 'drift') {
    result.values.push({ label: 'Rear Accel Lock', f: '100%' });
    result.values.push({ label: 'Rear Decel Lock', f: '10%' });
    result.note = 'Full accel lock keeps both rear tyres spinning together for maximum sustained drift angle. Low decel lock lets the car rotate freely when you lift off the throttle, making transitions smoother.';

    if (dt === 'AWD') {
      result.values.push({ label: 'Front Accel Lock', f: '15 - 25%' });
      result.values.push({ label: 'Front Decel Lock', f: '5 - 15%' });
      result.values.push({ label: 'Centre Balance', f: '75 - 85% rear' });
      result.note += ' For AWD drifting, send most of the power to the rear. Keep the front diff loose so it does not fight the drift.';
    }
  } else if (style === 'drag') {
    result.values.push({ label: 'Rear Accel Lock', f: '100%' });
    result.values.push({ label: 'Rear Decel Lock', f: '0%' });
    result.note = 'Full accel lock ensures both rear tyres put power down together. Zero decel lock is irrelevant in a straight line.';

    if (dt === 'AWD') {
      result.values.push({ label: 'Front Accel Lock', f: '100%' });
      result.values.push({ label: 'Front Decel Lock', f: '0%' });
      result.values.push({ label: 'Centre Balance', f: '50 - 60% rear' });
      result.note = 'Full lock on both axles for maximum traction. Send slightly more to the rear for weight transfer.';
    }
  } else if (style === 'offroad') {
    result.values.push({ label: 'Rear Accel Lock', f: (50 + s * 10).toFixed(0) + '%' });
    result.values.push({ label: 'Rear Decel Lock', f: (20 + s * 10).toFixed(0) + '%' });
    result.note = 'Moderate accel lock gives traction without making the car push on exit.';

    if (dt === 'AWD') {
      result.values.push({ label: 'Front Accel Lock', f: (35 + s * 10).toFixed(0) + '%' });
      result.values.push({ label: 'Front Decel Lock', f: (15 + s * 5).toFixed(0) + '%' });
      result.values.push({ label: 'Centre Balance', f: '55 - 65% rear' });
      result.note += ' For AWD off-road, moderate front diff helps pull the car through rough sections. Centre balance slightly rear-biased for stability.';
    }
    if (dt === 'FWD') {
      result.values = [
        { label: 'Front Accel Lock', f: (50 + s * 10).toFixed(0) + '%' },
        { label: 'Front Decel Lock', f: (20 + s * 10).toFixed(0) + '%' }
      ];
      result.note = 'Moderate lock gives traction without too much torque steer under power.';
    }
  } else {
    // road / street
    result.values.push({ label: 'Rear Accel Lock', f: (55 + s * 15).toFixed(0) + '%' });
    result.values.push({ label: 'Rear Decel Lock', f: (20 + s * 10).toFixed(0) + '%' });
    result.note = 'Moderate accel lock for traction on exit. Low decel lock keeps the car stable under braking.';

    if (dt === 'AWD') {
      result.values.push({ label: 'Front Accel Lock', f: (25 + s * 10).toFixed(0) + '%' });
      result.values.push({ label: 'Front Decel Lock', f: (10 + s * 5).toFixed(0) + '%' });
      result.values.push({ label: 'Centre Balance', f: '60 - 70% rear' });
      result.note += ' For AWD, keep front diff loose to avoid understeer. Rear-biased centre balance gives a more natural feel.';
    }
    if (dt === 'FWD') {
      result.values = [
        { label: 'Front Accel Lock', f: (50 + s * 15).toFixed(0) + '%' },
        { label: 'Front Decel Lock', f: (20 + s * 10).toFixed(0) + '%' }
      ];
      result.note = 'Moderate front accel lock gives traction without torque steer. Low decel lock helps the car rotate on turn-in.';
    }
  }

  return result;
}
