 document.addEventListener("DOMContentLoaded", function () {

　//HAIプロポボタン
  const toggleButton = document.getElementById("toggle-propofol");
  const propofolInputArea = document.getElementById("propofol-input-area");
  
  toggleButton.addEventListener("click", function () {
    const isVisible = propofolInputArea.style.display === "block";
    propofolInputArea.style.display = isVisible ? "none" : "block";
    toggleButton.textContent = isVisible ? "プロポフォール ON" : "プロポフォール OFF";
    calculateHAI(); // ← 追加！
  });
  
  // タブ切り替え
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((btn) => {
      
      btn.addEventListener("click", function () {
          const target = this.dataset.target;
          tabButtons.forEach((b) => b.classList.remove("active"));
          tabContents.forEach((c) => c.classList.remove("active"));
          this.classList.add("active");
          document.getElementById(target).classList.add("active");
          if (target === "hai") {
              initHAI();
              }
    });
});
  
  
//必要栄養量計算タブ
  const weightInput = document.getElementById("weightInput");
  const kcalFactorInput = document.getElementById("kcalFactorInput");
  const conditionSelect = document.getElementById("conditionSelect");
  weightInput.addEventListener("input", calculateNeeds);
  kcalFactorInput.addEventListener("input", () => {
    document.getElementById("kcalFactorDisplay").textContent = kcalFactorInput.value;
    calculateNeeds();
  });
  conditionSelect.addEventListener("change", calculateNeeds);

let obesityCheckOn = false; // 初期状態はOFF

document.getElementById("checkObesity").addEventListener("click", function () {
  obesityCheckOn = !obesityCheckOn;
  const heightArea = document.getElementById("heightInputArea");
  const button = document.getElementById("checkObesity");

  if (obesityCheckOn) {
    heightArea.style.display = "block";
  } else {
    heightArea.style.display = "none";
  }

  calculateNeeds(); // 状態変更時に再計算
});
document.getElementById("heightInput").addEventListener("input", function () {
  if (obesityCheckOn) {
    calculateNeeds();
  }
});
  

function calculateNeeds() {
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(document.getElementById("heightInput").value);
  const kcalFactor = parseFloat(kcalFactorInput.value);
  const selectedOption = conditionSelect.options[conditionSelect.selectedIndex];

  const proteinMin = parseFloat(selectedOption.dataset.min);
  const proteinMax = parseFloat(selectedOption.dataset.max);
  
  calculateRefeedingRisk();

  if (isNaN(weight) || weight <= 0 || isNaN(proteinMin) || isNaN(proteinMax)) {
    document.getElementById("needsResult").innerHTML = "<p>体重（半角数字）と病態を正しく入力してください。</p>";
    return;
  }

  let baseWeight = weight;
  let bmi = null;
  let usedAdjustedWeight = false;

  if (obesityCheckOn && !isNaN(height) && height > 0) {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);

    if (bmi >= 30) {
      const idealWeight = 22 * (heightM * heightM);
      const adjustedWeight = idealWeight + 0.225 * (weight - idealWeight);
      baseWeight = adjustedWeight;
      usedAdjustedWeight = true;
    }
  }

  const totalKcal = baseWeight * kcalFactor;
  const totalProteinMin = baseWeight * proteinMin;
  const totalProteinMax = baseWeight * proteinMax;

  let proteinDisplay = "";
  if (proteinMin === proteinMax) {
    proteinDisplay = `${totalProteinMin.toFixed(1)} g/day`;
    protein_max = totalProteinMax
    protein_min  = totalProteinMin;
  } else {
    proteinDisplay = `${totalProteinMin.toFixed(1)} ～ ${totalProteinMax.toFixed(1)} g/day`;
    protein_max = totalProteinMax
    protein_min  = totalProteinMin;
  }

  let note = "";
  if (obesityCheckOn && bmi !== null) {
    if (usedAdjustedWeight) {
      note = `<p><strong>BMI:</strong> ${bmi.toFixed(1)}（BMI>=30のため調整体重${baseWeight.toFixed(1)}kg(＝理想体重＋(0.225(実体重- 理想体重)))で栄養計算)</p>`;
    } else {
      note = `<p><strong>BMI:</strong> ${bmi.toFixed(1)}（BMI<30のため実体重で栄養計算）</p>`;
    }
  }
  
  calorieNeeds = totalKcal
  
  
  // 平均タンパク量（初期値として使用）
  var proteinAvg = ((protein_min + protein_max) / 2).toFixed(1);
  document.getElementById("input-calorie").value = calorieNeeds.toFixed(0);
  document.getElementById("input-protein").value = proteinAvg;
  document.getElementById("input-fat").value = 0;
  

  document.getElementById("needsResult").innerHTML = `
    <hr>
    ${note}
    <p><strong>必要カロリー:</strong> ${Math.round(totalKcal)} kcal/day</p>
    <p><strong>必要タンパク量:</strong> ${proteinDisplay}</p>
  `;
}

let refeedLoss = null, refeedFast = null, refeedElect = null, refeedMed = null;
function calculateRefeedingRisk() {
  const weight = parseFloat(document.getElementById("weightInput").value);
  const height = parseFloat(document.getElementById("refeedHeight").value);
  const resultEl = document.getElementById("refeedingRiskResult");

  const hasWeight = !isNaN(weight) && weight > 0;
  const hasHeight = !isNaN(height) && height > 0;

  let bmi = null;
  if (hasWeight && hasHeight) {
    bmi = weight / ((height / 100) ** 2);
  }

  let score = 0;

  // 即高リスク項目（+2点）
  if (bmi !== null && bmi < 16) score += 2;
  if (refeedLoss === 15) score += 2;
  if (refeedFast === 10) score += 2;
  if (refeedElect === 'yes') score += 2;

  // 条件②のリスク因子（+1点）
  if (bmi !== null && bmi < 18.5) score += 1;
  if (refeedLoss === 10) score += 1;
  if (refeedFast === 5) score += 1;
  if (refeedMed === 'yes') score += 1;

  // 高リスク判定
  if (score >= 2) {
    resultEl.innerHTML = '<p style="color:red;"><strong>⚠️ 高リスク: Refeeding症候群の危険性があります</strong></p>';
    return;
  }

  // 未入力のチェック
  const isIncomplete = (
    !hasWeight || !hasHeight ||
    refeedLoss === null ||
    refeedFast === null ||
    refeedElect === null ||
    refeedMed === null
  );

  if (isIncomplete) {
    if (hasHeight && !hasWeight) {
      resultEl.innerHTML = '<p>体重が入力されていません。全ての項目を入力してください。</p>';
    } else {
      resultEl.innerHTML = '<p>全ての項目を入力してください。</p>';
    }
    return;
  }

  // 低リスク判定
  resultEl.innerHTML = '<p style="color:green;"><strong>低リスク: Refeedingリスクは高くありません</strong></p>';
}

document.getElementById("toggleRefeedingRisk").addEventListener("click", () => {
  const area = document.getElementById("refeedingRiskArea");
  area.style.display = area.style.display === "none" ? "block" : "none";
});

document.getElementById("refeedHeight").addEventListener("input", calculateRefeedingRisk);

document.querySelectorAll(".loss-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    refeedLoss = parseInt(btn.dataset.value);
    calculateRefeedingRisk();
  });
});

document.querySelectorAll(".fast-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    refeedFast = parseInt(btn.dataset.value);
    calculateRefeedingRisk();
  });
});

document.querySelectorAll(".elect-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    refeedElect = btn.dataset.value;
    calculateRefeedingRisk();
  });
});

document.querySelectorAll(".med-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    refeedMed = btn.dataset.value;
    calculateRefeedingRisk();
  });
});

document.querySelectorAll('.option-group').forEach(group => {
  group.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
      // 全てのボタンから.selectedを外す
      this.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
      // クリックされたボタンに.selectedを追加
      e.target.classList.add('selected');
    }
  });
});

function updateBMI() {
  const weight = parseFloat(document.getElementById("weightInput").value);
  const height = parseFloat(document.getElementById("refeedHeight").value);
  const bmiEl = document.getElementById("bmiDisplay");

  if (!isNaN(weight) && weight > 0 && !isNaN(height) && height > 0) {
    const bmi = weight / ((height / 100) ** 2);
    bmiEl.textContent = `BMI: ${bmi.toFixed(1)}`;
  } else {
    bmiEl.textContent = '';
  }
}

// イベントリスナーで updateBMI を呼び出すだけにする
document.getElementById("weightInput").addEventListener("input", updateBMI);
document.getElementById("refeedHeight").addEventListener("input", updateBMI);

//栄養製剤計算

for (let i = 0; i < 4; i++) {
  const quickArea = document.getElementById(`quick${i + 1}`);
  const select = document.querySelector(`select[data-index='${i}']`);
  const inputContainer = document.getElementById(`inputContainer${i}`);

  // クイックボタン生成
  quickList.forEach((key) => {
    const btn = document.createElement("button");
    btn.className = "formula-btn";
    btn.textContent = formulas[key].name;
    btn.addEventListener("click", () => {
      select.value = key;
      select.dispatchEvent(new Event("change"));
    });
    quickArea.appendChild(btn);
  });


// セレクトメニュー生成
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = `-- 他の製剤を選択 --`;
select.appendChild(defaultOption);

let index = 0;
for (const [key, formula] of Object.entries(formulas)) {
  if (sectionTitles.hasOwnProperty(index)) {
    const section = document.createElement("option");
    section.disabled = true;
    section.textContent = sectionTitles[index];
    select.appendChild(section);
  }

  const option = document.createElement("option");
  option.value = key;
  option.textContent = formula.name;
  select.appendChild(option);

  index++;
}

  // セレクト変更時の処理
  // 以下は製剤選択時のイベントリスナー内の全体コード（OFFボタンを含む）
document.querySelectorAll(".formula-select").forEach((select) => {
  select.addEventListener("change", () => {
    const index = parseInt(select.dataset.index, 10);
    const selected = select.value;
    const inputContainer = document.getElementById(`inputContainer${index}`);
    inputContainer.innerHTML = "";

    if (!selected || !formulas[selected]) return;

    if (formulas[selected].type === "rate") {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "8px";

  const label = document.createElement("label");
  label.textContent = "速度 (mL/h): ";

  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.className = "rate";
  input.addEventListener("input", calculateInfusion);

  label.appendChild(input);
  container.appendChild(label);

  const presetContainer = document.createElement("div");
  presetContainer.className = "preset-container";

  const rateValues = [10, 20, 30, 40, 50, 60];
  const rateButtons = [];

  rateValues.forEach((val) => {
    const btn = document.createElement("button");
    btn.textContent = val;
    btn.type = "button";
    btn.className = "preset-btn";
    btn.addEventListener("click", () => {
      input.value = val;
      input.dispatchEvent(new Event("input"));
    });
    presetContainer.appendChild(btn);
    rateButtons.push(btn);
  });

  // 間欠/持続トグルボタン
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "間欠";
  toggleBtn.type = "button";
  toggleBtn.className = "preset-btn";

  let isIntermittent = false;
  toggleBtn.addEventListener("click", () => {
    isIntermittent = !isIntermittent;
    if (isIntermittent) {
  toggleBtn.textContent = "持続";
  rateButtons.forEach(btn => btn.style.display = "none");
  label.childNodes[0].nodeValue = "量(mL/day): ";  // ラベルを変更
  input.dataset.mode = "intermittent";        // ← ★ここに書く！
} else {
  toggleBtn.textContent = "間欠";
  rateButtons.forEach(btn => btn.style.display = "inline-block");
  label.childNodes[0].nodeValue = "速度 (mL/h): ";  // ラベルを元に戻す
  input.dataset.mode = "continuous";               // ← ★戻すときは連続モード
}
calculateInfusion();
  });
  
  presetContainer.appendChild(toggleBtn);

  // OFFボタン
  const offBtn = document.createElement("button");
  offBtn.textContent = "OFF";
  offBtn.type = "button";
  offBtn.className = "preset-btn";
  offBtn.addEventListener("click", () => {
    select.value = "";
    inputContainer.innerHTML = "";
    calculateInfusion();
  });
  presetContainer.appendChild(offBtn);

  container.appendChild(presetContainer);
  inputContainer.appendChild(container);
} else if (formulas[selected].type === "count") {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.gap = "8px";

      const label = document.createElement("label");
      label.textContent = "個数: ";

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "0.1";
      input.className = "count";
      input.addEventListener("input", calculateInfusion);

      label.appendChild(input);
      container.appendChild(label);

      const presetContainer = document.createElement("div");
      presetContainer.className = "preset-container";

      [1, 2, 3, 4].forEach((val) => {
        const btn = document.createElement("button");
        btn.textContent = val;
        btn.type = "button";
        btn.className = "preset-btn";
        btn.addEventListener("click", () => {
          input.value = val;
          input.dispatchEvent(new Event("input"));
        });
        presetContainer.appendChild(btn);
      });

      const offBtn = document.createElement("button");
      offBtn.textContent = "OFF";
      offBtn.type = "button";
      offBtn.className = "preset-btn";
      offBtn.addEventListener("click", () => {
        select.value = "";
        inputContainer.innerHTML = "";
        calculateInfusion();
      });
      presetContainer.appendChild(offBtn);

      container.appendChild(presetContainer);
      inputContainer.appendChild(container);
    }

    calculateInfusion();
  });
});
}

  
  // 比較ボタンを作成してbodyに追加
const compareBtn = document.createElement("button");
compareBtn.textContent = "製剤比較(120mLあたり)";
compareBtn.className = "compare-btn";
compareBtn.style.marginTop = "20px";
compareBtn.addEventListener("click", () => {
  for (let i = 0; i < 4; i++) {
    const select = document.querySelector(`select[data-index='${i}']`);
    const selected = select.value;
    if (!formulas[selected]) continue;

    if (formulas[selected].type === "rate") {
      const input = document.querySelector(`#inputContainer${i} .rate`);
      if (input) {
        input.value = 5;
        input.dispatchEvent(new Event("input")); // 再計算させる
      }
    }
  }
});

const target = document.getElementById("inputContainer3"); // 製剤4のinputContainer
if (target && target.parentNode) {
  target.parentNode.insertBefore(compareBtn, target.nextSibling);
} else {
  document.body.appendChild(compareBtn); // フォールバック
}

function calculateInfusion() {
  let totalKcal = 0;
  let totalProtein = 0;
  let totalfat = 0;
  let totalWater = 0;
  let totalNa = 0;
  let totalK = 0;
  let totalNaEq = 0;
  let totalKEq = 0;
  let resultHTML = "";
  let npcnratio = 0;

  // 重複なく製剤名＋メモを保持するMap（キー: 製剤名, 値: memo）
  const memoMap = new Map();

  const selects = document.querySelectorAll(".formula-select");
  selects.forEach((select, i) => {
    const key = select.value;
    if (!key || !formulas[key]) return;
    const formula = formulas[key];
    const inputDiv = document.getElementById(`inputContainer${i}`);

    if (formula.type === "rate") {
  const rateInput = inputDiv.querySelector(".rate");
  const rate = parseFloat(rateInput?.value);
  if (isNaN(rate) || rate <= 0) return;

  // モードを確認（intermittent: 間欠）
  const isIntermittent = rateInput.dataset.mode === "intermittent";

  const volume = isIntermittent ? rate : rate * 24;

  const kcal = volume * formula.kcalPerMl;
  const protein = volume * formula.proteinPerMl;
  const fat = volume * formula.fatPerMl;
  const water = volume;
  const na = formula.naPerMl ? volume * formula.naPerMl : 0;
  const k = formula.kPerMl ? volume * formula.kPerMl : 0;
  const naEq = formula.naEqPerMl ? volume * formula.naEqPerMl : 0;
  const kEq = formula.kEqPerMl ? volume * formula.kEqPerMl : 0;

  totalKcal += kcal;
  totalProtein += protein;
  totalfat += fat;
  totalWater += water;
  totalNa += na;
  totalK += k;
  totalNaEq += naEq;
  totalKEq += kEq;
  npcnratio = (totalKcal-totalProtein*4)/(totalProtein/6.25);

  resultHTML += `<p><strong>${formula.name}</strong>：${volume} mL → ${Math.round(kcal)} kcal, タンパク質${Math.round(protein)}g, 脂質${Math.round(fat)}g, Na: ${Math.round(na)}mg, K:${Math.round(k)}mg, Na:${Math.round(naEq)}mEq, K:${Math.round(kEq)}mEq</p>`;

  if (formula.memo && !memoMap.has(formula.name)) {
    memoMap.set(formula.name, formula.memo);
  }
} else if (formula.type === "count") {
      const countInput = inputDiv.querySelector(".count");
      const count = parseFloat(countInput?.value);
      if (isNaN(count) || count <= 0) return;
      const kcal = count * formula.kcalPerUnit;
      const protein = count * formula.proteinPerUnit;
      const fat = count * formula.fatPerUnit;
      const water = count * formula.waterPerUnit;
      const na = formula.naPerUnit ? count * formula.naPerUnit : 0;
      const k = formula.kPerUnit ? count * formula.kPerUnit : 0;
      const naEq = formula.naEqPerUnit ? count * formula.naEqPerUnit : 0;
      const kEq = formula.kEqPerUnit ? count * formula.kEqPerUnit : 0;

      totalKcal += kcal;
      totalProtein += protein;
      totalfat += fat;
      totalWater += water;
      totalNa += na;
      totalK += k;
      totalNaEq += naEq;
      totalKEq += kEq;
      npcnratio = (totalKcal-totalProtein*4)/(totalProtein/6.25);

      resultHTML += `<p><strong>${formula.name}</strong>：${count} 個 → ${Math.round(kcal)} kcal, タンパク質${Math.round(protein)}g, 脂質${Math.round(fat)}g, Na:${Math.round(na)}mg, K:${Math.round(k)}mg, Na:${Math.round(naEq)}mEq, K:${Math.round(kEq)}mEq</p>`;

      if (formula.memo && !memoMap.has(formula.name)) {
        memoMap.set(formula.name, formula.memo);
      }
    }
  });

  // カロリー計算と割合は変わらず
  const proteinKcal = totalProtein * 4;
  const fatKcal = totalfat * 9;
  const proteinRatio = Math.round(isNaN(proteinKcal / totalKcal) ? 0 : (proteinKcal / totalKcal) * 100);
  const fatRatio = Math.round(isNaN(fatKcal / totalKcal) ? 0 : (fatKcal / totalKcal) * 100);
  const carbRatio =  totalWater > 0 ? (100-fatRatio-proteinRatio > 0 ? 100-fatRatio-proteinRatio : 0):0;

  resultHTML += `<hr><p><strong>合計:</strong> 水分${Math.round(totalWater)} mL</p>`;
  

  if (isFinite(npcnratio)) {
  resultHTML += `<p>${Math.round(totalKcal)} kcal (炭水化物: ${carbRatio}% タンパク質: ${proteinRatio}% 脂質: ${fatRatio}%)　タンパク質 ${Math.round(totalProtein)} g, 脂質 ${Math.round(totalfat)} g, NPC/N ratio: ${Math.round(npcnratio * 10) / 10}</p>`;
} else {
  resultHTML += `<p>${Math.round(totalKcal)} kcal (炭水化物: ${carbRatio}% タンパク質: ${proteinRatio}% 脂質: ${fatRatio}%)　タンパク質 ${Math.round(totalProtein)} g, 脂質 ${Math.round(totalfat)} g, NPC/N ratio: タンパク含有なし</p>`;
}

  resultHTML += `<p>Na: ${Math.round(totalNa)} mg, K: ${Math.round(totalK)} mg, Na: ${Math.round(totalNaEq)} mEq, K: ${Math.round(totalKEq)} mEq　(経管栄養はmg, 輸液はmEqでそれぞれ合算)</p>`;

  // 重複なしメモ表示
  if (memoMap.size > 0) {
    memoMap.forEach((memo, name) => {
      resultHTML += `<p><strong>${name}:</strong> <span style="color:red">${memo}</span></p>`;
    });
    resultHTML += `</div>`;
  }

  document.getElementById("infusionResult").innerHTML = resultHTML || "<p>有効な入力がありません。</p>";
}

//hai

function initHAI() {
  const calorieEl = document.getElementById("default-calorie");
  const proteinEl = document.getElementById("default-protein");
  const infoParagraph = calorieEl.closest("p"); // <p> タグ全体を取得

  if (calorieNeeds > 0 && protein_min > 0) {
    // 表示更新
    calorieEl.textContent = calorieNeeds.toFixed(0);
    let proteinDisplay = protein_min === protein_max
      ? protein_min.toFixed(1)
      : `${protein_min.toFixed(1)}〜${protein_max.toFixed(1)}`;
    proteinEl.textContent = proteinDisplay;

    // <p>を表示
    infoParagraph.style.display = "block";
  } else {
    // <p>を非表示
    infoParagraph.style.display = "none";
  }

  calculateHAI(); // 初期計算
}


function calculateHAI() {
  var protein = parseFloat(document.getElementById("input-protein").value) || 0;
  var fat = parseFloat(document.getElementById("input-fat").value) || 0;
  var totalKcal = parseFloat(document.getElementById("input-calorie").value) || 0;

  var propofolRate = 0;
  if (document.getElementById("propofol-input-area").style.display !== "none") {
    propofolRate = parseFloat(document.getElementById("propofol-rate")?.value) || 0;
  }

  var propofolKcal = propofolRate * 24 * 1.1;
  var kcalFromProtein = protein * 4;
  var kcalFromFat = fat * 9;
  var kcalFromPF = kcalFromProtein + kcalFromFat + propofolKcal;

  var amiparenMl = protein * 10;
  var intralipidMl = fat*50/(100/9)
  var residualKcal = totalKcal - kcalFromPF;
  var haikalykMl = residualKcal > 0 ? residualKcal / 2 : 0;

  var pPct = totalKcal > 0 ? (kcalFromProtein / totalKcal) * 100 : 0;
  var fPct = totalKcal > 0 ? ((kcalFromFat + propofolKcal) / totalKcal) * 100 : 0;
  var cPct = totalKcal > 0 ? 100 - pPct - fPct : 0;

  document.getElementById("amiparen-ml").textContent = amiparenMl.toFixed(1);
  document.getElementById("haikalyk-ml").textContent = haikalykMl.toFixed(1);
  document.getElementById("intralipid-ml").textContent = intralipidMl.toFixed(1);

  // --- カロリー構成の表示 ---
  let ratioEl = document.getElementById("nutrient-ratio");
  if (!ratioEl) {
    ratioEl = document.createElement("p");
    ratioEl.id = "nutrient-ratio";
    const reference = document.getElementById("intralipid-ml").parentElement;
    reference.parentNode.insertBefore(ratioEl, reference.nextSibling);
  }
  ratioEl.innerHTML = `合計水分量：${amiparenMl+intralipidMl+haikalykMl+(propofolRate * 24)}mL, カロリー構成： 炭水化物 ${cPct.toFixed(0)}%、タンパク質 ${pPct.toFixed(0)}%、脂質 ${fPct.toFixed(0)}%`;

// --- 総カロリーオーバー時のエラー表示 ---
let errorEl = document.getElementById("calorie-over-error");

// ここで値をしっかり確認
if (!isNaN(kcalFromPF) && !isNaN(totalKcal) && totalKcal > 0) {
  if (kcalFromPF > totalKcal) {
    errorEl.style.display = "block";
  } else {
    errorEl.style.display = "none";
  }
} else {
  // 値が未入力などで比較不能な場合は非表示
  errorEl.style.display = "none";
}

const intralipidRow = document.getElementById("intralipid-row");
if (fat > 0) {
  document.getElementById("intralipid-ml").textContent = intralipidMl.toFixed(1);
  intralipidRow.style.display = "block";
} else {
  intralipidRow.style.display = "none";
}

}
document.getElementById("input-protein").addEventListener("input", calculateHAI);
document.getElementById("input-fat").addEventListener("input", calculateHAI);
document.getElementById("input-calorie").addEventListener("input", calculateHAI);
document.getElementById("propofol-rate").addEventListener("input", calculateHAI);      

});
