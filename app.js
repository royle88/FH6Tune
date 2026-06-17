function generate() {
  var carName = document.getElementById('car-name').value.trim();
  var carClass = document.getElementById('car-class').value;
  var drivetrainEl = document.querySelector('input[name="drivetrain"]:checked');
  var disciplineEl = document.querySelector('input[name="discipline"]:checked');

  // Validation
  var valid = true;
  clearErrors();

  if (!carName) {
    showError('car-name', 'Please enter a car name');
    valid = false;
  }
  if (!carClass) {
    showError('car-class', 'Please select a class');
    valid = false;
  }
  if (!drivetrainEl) {
    showFieldError('drivetrain', 'Please select a drivetrain');
    valid = false;
  }
  if (!disciplineEl) {
    showFieldError('discipline', 'Please select a build purpose');
    valid = false;
  }

  if (!valid) return;

  var drivetrain = drivetrainEl.value;
  var discipline = disciplineEl.value;
  var tune = TUNES[discipline];

  if (!tune) {
    showToast('Unknown discipline');
    return;
  }

  // Build output
  var disciplineLabels = {
    drift: 'Drift',
    road: 'Road Racing',
    street: 'Street Racing',
    offroad: 'Off-Road',
    'cross-country': 'Cross Country',
    drag: 'Drag'
  };

  document.getElementById('output-title').textContent = carName;
  document.getElementById('output-subtitle').textContent =
    carClass + ' | ' + drivetrain + ' | ' + disciplineLabels[discipline];

  // Upgrades tab
  var upgrades = tune.upgrades(carClass, drivetrain);
  var upgradesHtml = '';

  upgradesHtml += '<div class="card"><p style="color:#aaa;line-height:1.6;">' + tune.description + '</p></div>';

  for (var category in upgrades) {
    if (!upgrades.hasOwnProperty(category)) continue;
    var items = upgrades[category];
    if (!items || items.length === 0) continue;

    upgradesHtml += '<div class="card">';
    upgradesHtml += '<h3>' + escapeHtml(category) + '</h3>';
    upgradesHtml += '<ul class="upgrade-list">';
    for (var i = 0; i < items.length; i++) {
      upgradesHtml += '<li><span class="part">' + escapeHtml(items[i].part) +
        '</span><span class="level">' + escapeHtml(items[i].level) + '</span></li>';
    }
    upgradesHtml += '</ul></div>';
  }

  upgradesHtml += '<div class="tip-box">';
  upgradesHtml += '<strong>Performance Index Note</strong><br><br>';
  upgradesHtml += 'These upgrade recommendations are a starting point for ' + escapeHtml(carClass) + ' class. ';
  upgradesHtml += 'Every car has a different PI cost for each part, so you may find yourself with headroom to spare or needing to dial things back. ';
  upgradesHtml += 'If you have PI left over after fitting these parts, feel free to push upgrades further (e.g. Sport to Race) wherever it benefits your build the most. ';
  upgradesHtml += 'Likewise, if you are over budget, drop the least impactful parts down a tier first.';
  upgradesHtml += '</div>';

  var engineSwaps = document.getElementById('engine-swaps').value.trim();
  if (engineSwaps) {
    var engines = engineSwaps.split('\n').filter(function (e) { return e.trim(); });
    if (engines.length > 0) {
      upgradesHtml += '<div class="card">';
      upgradesHtml += '<h3>Engine Swap Options</h3>';
      upgradesHtml += '<p style="color:#aaa;line-height:1.6;margin-bottom:10px;">The following engine swaps are available for this car. Choose based on your PI budget and build goals.</p>';
      upgradesHtml += '<ul class="upgrade-list">';
      for (var e = 0; e < engines.length; e++) {
        upgradesHtml += '<li><span class="part">' + escapeHtml(engines[e].trim()) + '</span></li>';
      }
      upgradesHtml += '</ul></div>';
    }
  }

  var notes = document.getElementById('car-notes').value.trim();
  if (notes) {
    upgradesHtml += '<div class="card">';
    upgradesHtml += '<h3>Your Notes</h3>';
    upgradesHtml += '<p style="color:#aaa;line-height:1.6;">' + escapeHtml(notes) + '</p>';
    upgradesHtml += '</div>';
  }

  document.getElementById('tab-upgrades').innerHTML = upgradesHtml;

  // Tuning tab
  var tuning = tune.tuning(carClass, drivetrain);
  var tuningHtml = '';

  for (var section in tuning) {
    if (!tuning.hasOwnProperty(section)) continue;
    var data = tuning[section];

    tuningHtml += '<div class="card">';
    tuningHtml += '<h3>' + escapeHtml(section) + '</h3>';
    tuningHtml += '<table>';
    for (var v = 0; v < data.values.length; v++) {
      tuningHtml += '<tr><td>' + escapeHtml(data.values[v].label) +
        '</td><td>' + escapeHtml(data.values[v].f) + '</td></tr>';
    }
    tuningHtml += '</table>';
    if (data.note) {
      tuningHtml += '<p class="card-note">' + escapeHtml(data.note) + '</p>';
    }
    tuningHtml += '</div>';
  }

  // Tips
  if (tune.tips && tune.tips.length > 0) {
    tuningHtml += '<div class="tip-box">';
    tuningHtml += '<strong>Adjustment Tips</strong><br><br>';
    for (var t = 0; t < tune.tips.length; t++) {
      tuningHtml += '&#8226; ' + escapeHtml(tune.tips[t]) + '<br>';
      if (t < tune.tips.length - 1) tuningHtml += '<br>';
    }
    tuningHtml += '</div>';
  }

  document.getElementById('tab-tuning').innerHTML = tuningHtml;

  // Show output
  document.getElementById('input-section').style.display = 'none';
  document.getElementById('output-section').style.display = 'block';
  switchTab('upgrades');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-content').forEach(function (c) {
    c.classList.remove('active');
  });
  document.getElementById('tab-' + tab).classList.add('active');
}

function resetForm() {
  document.getElementById('input-section').style.display = 'block';
  document.getElementById('output-section').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyBuild() {
  var title = document.getElementById('output-title').textContent;
  var subtitle = document.getElementById('output-subtitle').textContent;
  var lines = [title, subtitle, ''];

  lines.push('=== UPGRADES ===');
  lines.push('');
  var upgradeCards = document.querySelectorAll('#tab-upgrades .card');
  upgradeCards.forEach(function (card) {
    var h3 = card.querySelector('h3');
    if (h3) {
      lines.push(h3.textContent.toUpperCase());
      var items = card.querySelectorAll('.upgrade-list li');
      items.forEach(function (li) {
        var part = li.querySelector('.part');
        var level = li.querySelector('.level');
        if (part && level) {
          lines.push('  ' + part.textContent + ': ' + level.textContent);
        }
      });
      lines.push('');
    }
  });

  lines.push('=== TUNING ===');
  lines.push('');
  var tuningCards = document.querySelectorAll('#tab-tuning .card');
  tuningCards.forEach(function (card) {
    var h3 = card.querySelector('h3');
    if (h3) {
      lines.push(h3.textContent.toUpperCase());
      var rows = card.querySelectorAll('tr');
      rows.forEach(function (r) {
        var cells = r.querySelectorAll('td');
        if (cells.length === 2) {
          lines.push('  ' + cells[0].textContent + ': ' + cells[1].textContent);
        }
      });
      lines.push('');
    }
  });

  navigator.clipboard.writeText(lines.join('\n')).then(function () {
    showToast('Build copied to clipboard');
  });
}

function exportBuild() {
  var title = document.getElementById('output-title').textContent;
  var subtitle = document.getElementById('output-subtitle').textContent;
  var upgradesHtml = document.getElementById('tab-upgrades').innerHTML;
  var tuningHtml = document.getElementById('tab-tuning').innerHTML;

  var doc = '<!DOCTYPE html>\n<html lang="en-GB">\n<head>\n';
  doc += '<meta charset="UTF-8">\n';
  doc += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  doc += '<title>' + escapeHtml(title) + ' Build</title>\n';
  doc += '<style>\n';
  doc += '* { margin: 0; padding: 0; box-sizing: border-box; }\n';
  doc += 'body { background: #0f0f0f; color: #e0e0e0; font-family: "Segoe UI", sans-serif; font-size: 13px; padding: 16px; }\n';
  doc += 'h1 { text-align: center; font-size: 20px; color: #e8212b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }\n';
  doc += '.subtitle { text-align: center; color: #888; font-size: 12px; margin-bottom: 16px; }\n';
  doc += 'h2 { font-size: 16px; color: #e8212b; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 12px; }\n';
  doc += '.card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 14px; margin-bottom: 10px; max-width: 700px; margin-left: auto; margin-right: auto; }\n';
  doc += '.card h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #e8212b; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #2a2a2a; }\n';
  doc += '.card table { width: 100%; border-collapse: collapse; }\n';
  doc += '.card td { padding: 3px 0; font-size: 12px; } .card td:first-child { color: #888; } .card td:last-child { color: #fff; font-weight: 600; text-align: right; }\n';
  doc += '.card-note { font-size: 11px; color: #777; margin-top: 8px; padding-top: 6px; border-top: 1px solid #222; line-height: 1.5; }\n';
  doc += '.upgrade-list { list-style: none; } .upgrade-list li { padding: 4px 0; font-size: 12px; color: #ccc; display: flex; justify-content: space-between; border-bottom: 1px solid #1f1f1f; }\n';
  doc += '.upgrade-list li:last-child { border-bottom: none; } .upgrade-list .part { color: #888; } .upgrade-list .level { color: #fff; font-weight: 600; }\n';
  doc += '.tip-box { background: #e8212b0d; border: 1px solid #e8212b22; border-radius: 6px; padding: 12px; font-size: 11px; color: #aaa; line-height: 1.6; max-width: 700px; margin: 10px auto; }\n';
  doc += '.tip-box strong { color: #e8212b; }\n';
  doc += '</style>\n</head>\n<body>\n';
  doc += '<h1>' + escapeHtml(title) + '</h1>\n';
  doc += '<p class="subtitle">' + escapeHtml(subtitle) + '</p>\n';
  doc += '<h2 style="text-align:center;">Upgrades</h2>\n';
  doc += upgradesHtml + '\n';
  doc += '<h2 style="text-align:center;">Tuning</h2>\n';
  doc += tuningHtml + '\n';
  doc += '</body>\n</html>';

  var blob = new Blob([doc], { type: 'text/html' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = title.replace(/[^a-zA-Z0-9]/g, '_') + '_build.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Build exported');
}

// Helpers

function escapeHtml(text) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function showError(id, msg) {
  var el = document.getElementById(id);
  if (el) {
    el.parentElement.classList.add('error');
    var err = document.createElement('div');
    err.className = 'error-msg';
    err.textContent = msg;
    el.parentElement.appendChild(err);
  }
}

function showFieldError(name, msg) {
  var el = document.querySelector('input[name="' + name + '"]');
  if (el) {
    var group = el.closest('.form-group');
    if (group) {
      group.classList.add('error');
      var err = document.createElement('div');
      err.className = 'error-msg';
      err.textContent = msg;
      group.appendChild(err);
    }
  }
}

function clearErrors() {
  document.querySelectorAll('.form-group.error').forEach(function (g) {
    g.classList.remove('error');
  });
  document.querySelectorAll('.error-msg').forEach(function (e) {
    e.remove();
  });
}

function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 2000);
}
