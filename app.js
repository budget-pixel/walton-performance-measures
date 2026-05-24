const app = document.getElementById("app") || document.getElementById("wc-performance-measures");

const urlParams = new URLSearchParams(window.location.search);
const selectedDepartment = String(
  app?.dataset?.department ||
  urlParams.get("department") ||
  ""
).trim().toLowerCase();

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function normalizeValue(value){
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g,"and")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

function departmentMatches(record, selected){
  if(!selected){
    return true;
  }

  return normalizeValue(record.department) === normalizeValue(selected) ||
         String(record.department || "").trim().toLowerCase() === selected;
}

function countRowsWithSameObjective(rows, startIndex){
  const objective = String(rows[startIndex]?.objective || "").trim();
  let count = 0;

  for(let i = startIndex; i < rows.length; i++){
    const currentObjective = String(rows[i]?.objective || "").trim();

    if(currentObjective !== objective){
      break;
    }

    count++;
  }

  return count;
}

function getFiscalHeaders(record){
  const defaults = {
    actual2023: "Actual 2022-23",
    actual2024: "Actual 2023-24",
    projected2025: "Projected 2024-25",
    projected2026: "Projected 2025-26"
  };

  const labels = record?.fiscalYearLabels || record?.fiscalYears || {};

  return {
    actual2023: labels.actual2023 || labels.actual1 || defaults.actual2023,
    actual2024: labels.actual2024 || labels.actual2 || defaults.actual2024,
    projected2025: labels.projected2025 || labels.projected1 || defaults.projected2025,
    projected2026: labels.projected2026 || labels.projected2 || defaults.projected2026
  };
}

function renderDepartment(record){
  const rows = Array.isArray(record.rows) ? record.rows : [];
  const totalRows = Math.max(rows.length, 1);
  const fiscalHeaders = getFiscalHeaders(record);

  return `
    <section class="wc-performance-card">
      <div class="wc-performance-card-header">
        <span>Code Link ${escapeHtml(record.codeLink)}</span>
        <h2>${escapeHtml(record.department)}</h2>
        <div class="wc-performance-goal-block">
          <span class="wc-performance-goal-label">Departmental Goal</span>
          <p>${escapeHtml(record.goal)}</p>
        </div>
      </div>

      <div class="wc-performance-table-wrap">
        <table class="wc-performance-table">
          <thead>
            <tr>
              <th>Code Link</th>
              <th>Departmental Goal</th>
              <th>Objective</th>
              <th>Performance Measure</th>
              <th>${escapeHtml(fiscalHeaders.actual2023)}</th>
              <th>${escapeHtml(fiscalHeaders.actual2024)}</th>
              <th>${escapeHtml(fiscalHeaders.projected2025)}</th>
              <th>${escapeHtml(fiscalHeaders.projected2026)}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, index) => {
              const previousObjective = index > 0 ? String(rows[index - 1]?.objective || "").trim() : "";
              const currentObjective = String(row.objective || "").trim();
              const isFirstRow = index === 0;
              const isFirstObjectiveRow = currentObjective !== previousObjective;
              const objectiveRowspan = countRowsWithSameObjective(rows, index);

              return `
                <tr>
                  ${isFirstRow ? `<td class="wc-performance-code wc-performance-merged-cell" rowspan="${totalRows}" style="vertical-align:middle;">${escapeHtml(record.codeLink)}</td>` : ""}
                  ${isFirstRow ? `<td class="wc-performance-goal wc-performance-merged-cell" rowspan="${totalRows}" style="vertical-align:middle;">${escapeHtml(record.goal)}</td>` : ""}
                  ${isFirstObjectiveRow ? `<td class="wc-performance-objective wc-performance-merged-cell" rowspan="${objectiveRowspan}" style="vertical-align:middle;">${escapeHtml(row.objective)}</td>` : ""}
                  <td class="wc-performance-measure">${escapeHtml(row.measure)}</td>
                  <td class="wc-performance-value">${escapeHtml(row.actual2023)}</td>
                  <td class="wc-performance-value">${escapeHtml(row.actual2024)}</td>
                  <td class="wc-performance-value">${escapeHtml(row.projected2025)}</td>
                  <td class="wc-performance-value">${escapeHtml(row.projected2026)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <div class="wc-performance-note">
        The code link shown for this department corresponds to a Strategic Priority Initiative identified by the Walton County Board of County Commissioners.
        <a href="https://stories.opengov.com/countyofwaltonfl/cf6eaa7a-a98d-479a-9869-b20398ee38e5/published/re0lJHwus?currentPageId=6989dbbdf5cb414d7e5c7efb" target="_blank" rel="noopener noreferrer">View Strategic Priorities</a>.
      </div>
    </section>
  `;
}

function renderApp(){
  if(!app){
    return;
  }

  const allRecords = window.wcPerformanceMeasures || [];
  const records = allRecords.filter(record => departmentMatches(record, selectedDepartment));
  const isFiltered = Boolean(selectedDepartment);
  const isEmbedded = app.id === "wc-performance-measures" || isFiltered;

  app.innerHTML = `
    <main class="wc-performance-page ${isEmbedded ? "is-embedded" : ""}">
      ${!isEmbedded ? `
        <header class="wc-performance-header">
          <h1>Departmental Goals, Objectives, and Performance Measures</h1>
          <p>
            Review departmental goals, objectives, and performance measures used to track service delivery, operational outcomes, and budget priorities.
          </p>
        </header>
      ` : ""}

      ${records.length
        ? `<div style="display:grid;gap:28px;">${records.map(renderDepartment).join("")}</div>`
        : `<div class="wc-performance-empty">No department performance measures found for this selection.</div>`
      }
    </main>
  `;
}

renderApp();
