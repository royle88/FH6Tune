populateMakes();

function populateMakes() {
  var sel = document.getElementById('car-make');
  var makes = Object.keys(CAR_DATABASE).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  for (var i = 0; i < makes.length; i++) {
    var opt = document.createElement('option');
    opt.value = makes[i];
    opt.textContent = makes[i];
    sel.appendChild(opt);
  }
}

function populateModels() {
  var make = document.getElementById('car-make').value;
  var modelSel = document.getElementById('car-model');
  var carSel = document.getElementById('car-name');
  modelSel.innerHTML = '<option value="">Select model</option>';
  carSel.innerHTML = '<option value="">Select car</option>';
  carSel.disabled = true;
  if (!make) { modelSel.disabled = true; return; }
  modelSel.disabled = false;
  var models = Object.keys(CAR_DATABASE[make]).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  for (var i = 0; i < models.length; i++) {
    var opt = document.createElement('option');
    opt.value = models[i];
    opt.textContent = models[i];
    modelSel.appendChild(opt);
  }
  if (models.length === 1) {
    modelSel.value = models[0];
    populateCars();
  }
}

function populateCars() {
  var make = document.getElementById('car-make').value;
  var model = document.getElementById('car-model').value;
  var carSel = document.getElementById('car-name');
  carSel.innerHTML = '<option value="">Select car</option>';
  if (!make || !model) { carSel.disabled = true; return; }
  carSel.disabled = false;
  var cars = CAR_DATABASE[make][model];
  for (var i = 0; i < cars.length; i++) {
    var opt = document.createElement('option');
    opt.value = cars[i].name;
    opt.textContent = cars[i].name;
    opt.dataset.weight = cars[i].weight;
    carSel.appendChild(opt);
  }
  if (cars.length === 1) {
    carSel.value = cars[0].name;
  }
}

function toggleEngineInput() {
  var toggle = document.querySelector('input[name="engine-swap-toggle"]:checked');
  var group = document.getElementById('engine-swap-input-group');
  group.style.display = (toggle && toggle.value === 'yes') ? 'block' : 'none';
  if (toggle && toggle.value === 'no') {
    document.getElementById('engine-swap-text').value = '';
  }
}

function getSelectedEngines() {
  var toggle = document.querySelector('input[name="engine-swap-toggle"]:checked');
  if (!toggle || toggle.value === 'no') return [];
  var raw = document.getElementById('engine-swap-text').value;
  if (!raw.trim()) return [];
  var parts = raw.split(',');
  var matched = [];
  for (var i = 0; i < parts.length; i++) {
    var input = parts[i].trim().toLowerCase();
    if (!input) continue;
    for (var j = 0; j < ENGINE_SWAPS.length; j++) {
      if (ENGINE_SWAPS[j].toLowerCase() === input) {
        matched.push(ENGINE_SWAPS[j]);
        break;
      }
    }
  }
  return matched;
}

function generate() {
  var carName = document.getElementById('car-name').value;
  var carClass = document.getElementById('car-class').value;
  var drivetrainEl = document.querySelector('input[name="drivetrain"]:checked');
  var disciplineEl = document.querySelector('input[name="discipline"]:checked');

  var valid = true;
  clearErrors();

  if (!carName) { showError('car-name', 'Please select a car'); valid = false; }
  if (!carClass) { showError('car-class', 'Please select a class'); valid = false; }
  if (!drivetrainEl) { showFieldError('drivetrain', 'Please select a drivetrain'); valid = false; }
  if (!disciplineEl) { showFieldError('discipline', 'Please select a build purpose'); valid = false; }
  if (!valid) return;

  var drivetrain = drivetrainEl.value;
  var discipline = disciplineEl.value;
  var unitsEl = document.querySelector('input[name="units"]:checked');
  var units = unitsEl ? unitsEl.value : 'imperial';
  var engineSwaps = getSelectedEngines();
  var data = KNOWLEDGE[discipline];

  if (!data) {
    showToast('Unknown discipline');
    return;
  }

  var carSelEl = document.getElementById('car-name');
  var selectedOpt = carSelEl.options[carSelEl.selectedIndex];
  var carWeight = parseInt(selectedOpt.dataset.weight, 10) || 1400;

  document.getElementById('output-title').textContent = carName;
  var weightDisplay = units === 'imperial'
    ? Math.round(carWeight * 2.2046) + ' lbs'
    : carWeight + ' kg';
  document.getElementById('output-subtitle').textContent =
    carClass + ' | ' + drivetrain + ' | ' + data.name + ' | ' + weightDisplay;

  document.getElementById('input-section').style.display = 'none';
  document.getElementById('loading-section').style.display = 'block';
  document.getElementById('output-section').style.display = 'none';

  setTimeout(function () {
    var html = buildGuide(data, carClass, drivetrain, engineSwaps, discipline, carWeight, units);
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('output-section').style.display = 'block';
    document.getElementById('ai-response').innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 600);
}

function convertTuningUnits(sections, units) {
  if (units === 'metric') {
    sections.forEach(function (sec) {
      sec.values.forEach(function (v) {
        var val = v.value;
        if (val.indexOf('lbs/in') !== -1) {
          val = val.replace(/(\d+\.?\d*)\s+to\s+(\d+\.?\d*)\s+lbs\/in/g, function (m, lo, hi) {
            return (parseFloat(lo) / 56).toFixed(1) + ' to ' + (parseFloat(hi) / 56).toFixed(1) + ' kgf/mm';
          });
          val = val.replace(/(\d+\.?\d*)\s+lbs\/in/g, function (m, n) {
            return (parseFloat(n) / 56).toFixed(1) + ' kgf/mm';
          });
          v.value = val;
        }
      });
    });
  } else {
    sections.forEach(function (sec) {
      sec.values.forEach(function (v) {
        var val = v.value;
        if (val.indexOf(' cm') !== -1) {
          val = val.replace(/(\d+\.?\d*)\s*cm/g, function (m, n) {
            return (parseFloat(n) / 2.54).toFixed(1) + ' in';
          });
          v.value = val;
        }
      });
    });
  }
}

function buildGuide(data, cls, dt, engineSwaps, discipline, weight, units) {
  var html = '';

  html += '<p>' + escapeHtml(data.overview) + '</p>';

  // Engine swap advice
  if (engineSwaps && engineSwaps.length > 0) {
    html += '<h2>Engine Swap Recommendation</h2>';
    var best = recommendEngine(engineSwaps, discipline);
    html += '<table><thead><tr><th>Engine</th><th>Category</th></tr></thead><tbody>';
    for (var e = 0; e < engineSwaps.length; e++) {
      var cat = categoriseEngine(engineSwaps[e]);
      var catInfo = ENGINE_CATEGORIES[cat];
      var isBest = best && best.engine === engineSwaps[e];
      html += '<tr><td>' + (isBest ? '<strong>' : '') + escapeHtml(engineSwaps[e]) + (isBest ? ' (Recommended)</strong>' : '') + '</td>';
      html += '<td>' + escapeHtml(catInfo ? catInfo.type : '') + '</td></tr>';
    }
    html += '</tbody></table>';
    if (best) {
      var bestCat = ENGINE_CATEGORIES[best.category];
      html += '<p><strong>Recommended: ' + escapeHtml(best.engine) + '</strong></p>';
      if (bestCat) {
        html += '<p class="tune-note">' + escapeHtml(bestCat.traits) + '</p>';
      }
    }
    html += '<p>' + escapeHtml(data.engineSwapAdvice) + '</p>';
  }

  // Tuning
  html += '<h2>Tuning</h2>';

  var tuning = data.getTuning(cls, dt, weight);
  convertTuningUnits(tuning, units);
  for (var t = 0; t < tuning.length; t++) {
    var sec = tuning[t];
    html += '<h3>' + escapeHtml(sec.name) + '</h3>';
    html += '<table><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody>';
    for (var v = 0; v < sec.values.length; v++) {
      html += '<tr><td>' + escapeHtml(sec.values[v].label) + '</td>';
      html += '<td>' + escapeHtml(sec.values[v].value) + '</td></tr>';
    }
    html += '</tbody></table>';
    if (sec.note) {
      html += '<p class="tune-note">' + escapeHtml(sec.note) + '</p>';
    }
  }

  // Tips
  if (data.tips && data.tips.length > 0) {
    html += '<h2>Adjustment Tips</h2>';
    html += '<ul>';
    for (var tip = 0; tip < data.tips.length; tip++) {
      html += '<li>' + escapeHtml(data.tips[tip]) + '</li>';
    }
    html += '</ul>';
  }

  return html;
}

function resetForm() {
  document.getElementById('input-section').style.display = 'block';
  document.getElementById('loading-section').style.display = 'none';
  document.getElementById('output-section').style.display = 'none';
  document.getElementById('car-make').value = '';
  document.getElementById('car-model').innerHTML = '<option value="">Select model</option>';
  document.getElementById('car-model').disabled = true;
  document.getElementById('car-name').innerHTML = '<option value="">Select car</option>';
  document.getElementById('car-name').disabled = true;
  var noRadio = document.querySelector('input[name="engine-swap-toggle"][value="no"]');
  if (noRadio) noRadio.checked = true;
  var engineText = document.getElementById('engine-swap-text');
  if (engineText) engineText.value = '';
  var engineGroup = document.getElementById('engine-swap-input-group');
  if (engineGroup) engineGroup.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyBuild() {
  var title = document.getElementById('output-title').textContent;
  var subtitle = document.getElementById('output-subtitle').textContent;
  var content = document.getElementById('ai-response').innerText;
  var text = title + '\n' + subtitle + '\n\n' + content;
  navigator.clipboard.writeText(text).then(function () {
    showToast('Build copied to clipboard');
  });
}

function exportBuild() {
  var title = document.getElementById('output-title').textContent;
  var subtitle = document.getElementById('output-subtitle').textContent;
  var responseHtml = document.getElementById('ai-response').innerHTML;

  var doc = '<!DOCTYPE html>\n<html lang="en-GB">\n<head>\n';
  doc += '<meta charset="UTF-8">\n';
  doc += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  doc += '<title>' + escapeHtml(title) + ' Build</title>\n';
  doc += '<style>\n';
  doc += '* { margin: 0; padding: 0; box-sizing: border-box; }\n';
  doc += 'body { background: #0f0f0f; color: #e0e0e0; font-family: "Segoe UI", sans-serif; font-size: 14px; padding: 20px; max-width: 700px; margin: 0 auto; line-height: 1.7; }\n';
  doc += 'h1 { text-align: center; font-size: 20px; color: #e8212b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }\n';
  doc += '.subtitle { text-align: center; color: #888; font-size: 12px; margin-bottom: 20px; }\n';
  doc += 'h2 { font-size: 16px; color: #e8212b; text-transform: uppercase; letter-spacing: 1.5px; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #2a2a2a; }\n';
  doc += 'h3 { font-size: 13px; color: #e8212b; text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 8px; }\n';
  doc += 'p { margin-bottom: 10px; color: #ccc; }\n';
  doc += 'strong { color: #fff; }\n';
  doc += 'ul, ol { margin: 8px 0 12px 20px; color: #ccc; } li { margin-bottom: 4px; }\n';
  doc += 'table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; background: #1a1a1a; border: 1px solid #2a2a2a; }\n';
  doc += 'th { background: #222; color: #e8212b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; text-align: left; font-weight: 600; }\n';
  doc += 'td { padding: 6px 12px; border-top: 1px solid #222; font-size: 13px; } td:first-child { color: #888; } td:last-child { color: #fff; font-weight: 600; }\n';
  doc += 'hr { border: none; border-top: 1px solid #2a2a2a; margin: 20px 0; }\n';
  doc += 'blockquote { border-left: 3px solid #e8212b; padding: 8px 14px; margin: 10px 0; background: #1a1a1a; color: #aaa; font-size: 13px; }\n';
  doc += '.tune-note { font-size: 12px; color: #777; margin-top: -8px; margin-bottom: 16px; }\n';
  doc += '</style>\n</head>\n<body>\n';
  doc += '<h1>' + escapeHtml(title) + '</h1>\n';
  doc += '<p class="subtitle">' + escapeHtml(subtitle) + '</p>\n';
  doc += responseHtml + '\n';
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
