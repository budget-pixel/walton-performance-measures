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

function renderDepartment(record){
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
              <th>Objectives</th>
              <th>Performance Measures</th>
              <th>Actual 2022-23</th>
              <th>Actual 2023-24</th>
              <th>Projected 2024-25</th>
              <th>Projected 2025-26</th>
            </tr>
          </thead>
          <tbody>
            ${record.rows.map(row => `
              <tr>
                <td class="wc-performance-objective">${escapeHtml(row.objective)}</td>
                <td class="wc-performance-measure">${escapeHtml(row.measure)}</td>
                <td class="wc-performance-value">${escapeHtml(row.actual2023)}</td>
                <td class="wc-performance-value">${escapeHtml(row.actual2024)}</td>
                <td class="wc-performance-value">${escapeHtml(row.projected2025)}</td>
                <td class="wc-performance-value">${escapeHtml(row.projected2026)}</td>
              </tr>
            `).join("")}
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
