const app = document.getElementById("app");

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function renderDepartment(record){
  return `
    <section class="wc-performance-card">
      <div class="wc-performance-card-header">
        <span>Code Link ${escapeHtml(record.codeLink)}</span>
        <h2>${escapeHtml(record.department)}</h2>
        <p>${escapeHtml(record.goal)}</p>
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
    </section>
  `;
}

function renderApp(){
  const records = window.wcPerformanceMeasures || [];

  app.innerHTML = `
    <main class="wc-performance-page">
      <header class="wc-performance-header">
        <h1>Departmental Goals, Objectives, and Performance Measures</h1>
        <p>
          Review departmental goals, objectives, and performance measures used to track service delivery, operational outcomes, and budget priorities.
        </p>
      </header>

      <div style="display:grid;gap:28px;">
        ${records.map(renderDepartment).join("")}
      </div>
    </main>
  `;
}

renderApp();
