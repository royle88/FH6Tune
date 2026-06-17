var MODEL = 'gemini-2.5-flash';

function getApiKey() {
  return localStorage.getItem('fh6tune_api_key') || '';
}

function saveApiKey() {
  var key = document.getElementById('api-key-input').value.trim();
  if (!key) {
    showToast('Please enter an API key');
    return;
  }
  localStorage.setItem('fh6tune_api_key', key);
  document.getElementById('api-key-section').style.display = 'none';
  document.getElementById('input-section').style.display = 'block';
  showToast('API key saved');
}

function clearApiKey() {
  localStorage.removeItem('fh6tune_api_key');
  document.getElementById('input-section').style.display = 'none';
  document.getElementById('output-section').style.display = 'none';
  document.getElementById('api-key-section').style.display = 'block';
  document.getElementById('api-key-input').value = '';
  showToast('API key cleared');
}

(function init() {
  if (getApiKey()) {
    document.getElementById('input-section').style.display = 'block';
  } else {
    document.getElementById('api-key-section').style.display = 'block';
  }
})();

var SYSTEM_PROMPT = [
  'You are a Forza Horizon 6 tuning expert. You provide detailed, specific upgrade and tuning guides for cars in Forza Horizon 6.',
  '',
  'Use UK English throughout. Do not use emdashes or double dashes.',
  '',
  'When the user tells you about their car, class, drivetrain, discipline, available engine swaps, and any preferences, you must respond with a complete build guide in two sections:',
  '',
  '## Upgrades',
  '',
  'Provide specific upgrade recommendations covering:',
  '- Engine (intake, exhaust, ignition, camshaft, valves, fuel system, oil/cooling)',
  '- Aspiration (turbo/supercharger type, intercooler)',
  '- Platform and Handling (brakes, springs/dampers, ARBs, roll cage, weight reduction, chassis stiffening)',
  '- Drivetrain (clutch, transmission, driveline, differential)',
  '- Tyres and Rims (compound, widths, rim weight)',
  '- Aero (front bumper, rear wing)',
  '- Engine swap recommendation if engine swaps are listed (explain which one to pick and why for this specific build)',
  '- Drivetrain conversion if relevant (e.g. AWD swap for off-road, RWD for drift)',
  '',
  'For each part, specify the upgrade level (Stock, Street, Sport, Race, or specific items like Drift Tyres, Rally Springs).',
  'Tailor recommendations to the specific car. Consider the car weight, power characteristics, and how it handles.',
  'Account for the target class PI budget. Lower classes need fewer upgrades. Higher classes can push more parts to Race.',
  '',
  'End the upgrades section with a note that every car has different PI costs per part, so if they have PI headroom they should push upgrades further, and if over budget they should drop the least impactful parts first.',
  '',
  '## Tuning',
  '',
  'Provide specific tuning values covering each menu in order:',
  '- Tyres (front and rear pressure in PSI)',
  '- Gearing (final drive and individual gear ratios or strategy)',
  '- Alignment (front/rear camber, front/rear toe, caster)',
  '- Anti-Roll Bars (front and rear values)',
  '- Springs (front/rear spring rate in kgf/mm, front/rear ride height)',
  '- Damping (front/rear rebound, front/rear bump)',
  '- Aero (front/rear downforce if fitted)',
  '- Brakes (pressure %, balance)',
  '- Differential (accel/decel lock %, front diff and centre balance for AWD/FWD)',
  '',
  'For drift builds specifically, use these proven baseline values:',
  '- Front tyre pressure: 29 PSI, Rear tyre pressure: 39 to 41 PSI',
  '- Front camber: -4.5 to -5.0, Rear camber: -0.5 to -1.0',
  '- Front toe: 0.3 out, Rear toe: 0.1 to 0.2 in',
  '- Caster: Max (~7.0)',
  '- Front ARB: 25 to 30, Rear ARB: 8 to 12',
  '- Front rebound: 8.0, Rear rebound: 6.5',
  '- Front bump: 3.0, Rear bump: 2.5',
  '- Brake balance: 48 to 50% rear',
  '- Diff acceleration: 100%, Diff deceleration: 10%',
  'Adjust these baselines based on the specific car characteristics and user preferences.',
  '',
  'For each tuning section, provide a brief explanation of why these values suit the car and build.',
  '',
  'End with an "Adjustment Tips" section with 3 to 5 bullet points for common problems and how to fix them, specific to the car and discipline.',
  '',
  'Use simple two-column markdown tables (Setting | Value) for tuning values. Do not use three-column tables. Use a separate table per tuning category (Tyres, Gearing, Alignment, etc.) with a ### heading above each one.',
  'For upgrades, use bullet point lists grouped under ### headings, not tables.',
  'Use ## for main sections (Upgrades, Tuning, Adjustment Tips) and ### for subsections.',
  'Be specific and confident in your recommendations. Give exact values, not vague ranges where possible.',
  'Consider the specific car characteristics (weight, power delivery, handling traits) when recommending values.'
].join('\n');

function generate() {
  var carName = document.getElementById('car-name').value.trim();
  var carClass = document.getElementById('car-class').value;
  var drivetrainEl = document.querySelector('input[name="drivetrain"]:checked');
  var disciplineEl = document.querySelector('input[name="discipline"]:checked');

  var valid = true;
  clearErrors();

  if (!carName) { showError('car-name', 'Please enter a car name'); valid = false; }
  if (!carClass) { showError('car-class', 'Please select a class'); valid = false; }
  if (!drivetrainEl) { showFieldError('drivetrain', 'Please select a drivetrain'); valid = false; }
  if (!disciplineEl) { showFieldError('discipline', 'Please select a build purpose'); valid = false; }
  if (!valid) return;

  if (!getApiKey()) {
    showToast('Please set your API key first');
    return;
  }

  var drivetrain = drivetrainEl.value;
  var discipline = disciplineEl.value;
  var engineSwaps = document.getElementById('engine-swaps').value.trim();
  var notes = document.getElementById('car-notes').value.trim();

  var disciplineLabels = {
    drift: 'Drift', road: 'Road Racing', street: 'Street Racing',
    offroad: 'Off-Road', 'cross-country': 'Cross Country', drag: 'Drag'
  };

  var userMessage = 'I have a ' + carName + '.\n';
  userMessage += 'Target class: ' + carClass + '\n';
  userMessage += 'Drivetrain: ' + drivetrain + '\n';
  userMessage += 'Build purpose: ' + disciplineLabels[discipline] + '\n';
  if (engineSwaps) {
    userMessage += '\nAvailable engine swaps:\n' + engineSwaps + '\n';
  }
  if (notes) {
    userMessage += '\nAdditional notes: ' + notes + '\n';
  }
  userMessage += '\nPlease provide a full upgrade and tuning guide for this build.';

  document.getElementById('output-title').textContent = carName;
  document.getElementById('output-subtitle').textContent =
    carClass + ' | ' + drivetrain + ' | ' + disciplineLabels[discipline];

  document.getElementById('input-section').style.display = 'none';
  document.getElementById('loading-section').style.display = 'block';
  document.getElementById('output-section').style.display = 'none';

  var statusMessages = [
    'Analysing your car and build requirements',
    'Working out the best upgrade path',
    'Calculating tuning values',
    'Fine-tuning the setup for your car'
  ];
  var statusIndex = 0;
  var statusInterval = setInterval(function () {
    statusIndex = (statusIndex + 1) % statusMessages.length;
    document.getElementById('loading-status').textContent = statusMessages[statusIndex];
  }, 3000);

  callGemini(userMessage).then(function (response) {
    clearInterval(statusInterval);
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('output-section').style.display = 'block';
    document.getElementById('ai-response').innerHTML = markdownToHtml(response);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }).catch(function (err) {
    clearInterval(statusInterval);
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('output-section').style.display = 'block';
    document.getElementById('ai-response').innerHTML =
      '<div class="error-card"><p>Something went wrong generating your build.</p>' +
      '<p style="font-size:12px;color:#888;">' + escapeHtml(err.message || String(err)) + '</p>' +
      '<button class="btn" onclick="resetForm()" style="margin-top:12px;">Try Again</button></div>';
  });
}

function callGemini(userMessage) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent?key=' + getApiKey();
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      generationConfig: {
        maxOutputTokens: 4096
      }
    })
  }).then(function (res) {
    if (!res.ok) {
      return res.json().then(function (data) {
        var msg = 'API error ' + res.status;
        if (data.error && data.error.message) msg = data.error.message;
        throw new Error(msg);
      });
    }
    return res.json();
  }).then(function (data) {
    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('No response from Gemini');
  });
}

function markdownToHtml(md) {
  var html = md;

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/gm, function (match, header, sep, body) {
    var cols = header.split('|').filter(function (c) { return c.trim(); });
    var alignments = sep.split('|').filter(function (c) { return c.trim(); }).map(function (c) {
      c = c.trim();
      if (c.startsWith(':') && c.endsWith(':')) return 'center';
      if (c.endsWith(':')) return 'right';
      return 'left';
    });
    var out = '<table><thead><tr>';
    cols.forEach(function (c, i) {
      out += '<th style="text-align:' + (alignments[i] || 'left') + '">' + c.trim() + '</th>';
    });
    out += '</tr></thead><tbody>';
    body.trim().split('\n').forEach(function (row) {
      var cells = row.split('|').filter(function (c) { return c.trim() !== ''; });
      out += '<tr>';
      cells.forEach(function (c, i) {
        out += '<td style="text-align:' + (alignments[i] || 'left') + '">' + c.trim() + '</td>';
      });
      out += '</tr>';
    });
    out += '</tbody></table>';
    return out;
  });

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and paragraphs around block elements
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[23]>)/g, '$1');
  html = html.replace(/(<\/h[23]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<table>)/g, '$1');
  html = html.replace(/(<\/table>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr>)/g, '$1');
  html = html.replace(/(<hr>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');

  return html;
}

function resetForm() {
  document.getElementById('input-section').style.display = 'block';
  document.getElementById('loading-section').style.display = 'none';
  document.getElementById('output-section').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-content').forEach(function (c) {
    c.classList.remove('active');
  });
  var el = document.getElementById('tab-' + tab);
  if (el) el.classList.add('active');
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
  doc += 'td { padding: 6px 12px; border-top: 1px solid #222; font-size: 13px; } td:last-child { color: #fff; font-weight: 600; text-align: right; }\n';
  doc += 'hr { border: none; border-top: 1px solid #2a2a2a; margin: 20px 0; }\n';
  doc += 'blockquote { border-left: 3px solid #e8212b; padding: 8px 14px; margin: 10px 0; background: #1a1a1a; color: #aaa; }\n';
  doc += 'code { background: #1a1a1a; padding: 2px 6px; border-radius: 3px; font-size: 13px; color: #e8212b; }\n';
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
