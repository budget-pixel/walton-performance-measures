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

function renderDepartment(record){
  const totalRows = record.rows.length;

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
              <th>Actual 2022-23</th>
              <th>Actual 2023-24</th>
              <th>Projected 2024-25</th>
              <th>Projected 2025-26</th>
            </tr>
          </thead>
          <tbody>
            ${record.rows.map((row, index) => {
              const previousObjective = index > 0 ? String(record.rows[index - 1]?.objective || "").trim() : "";
              const currentObjective = String(row.objective || "").trim();
              const isFirstRow = index === 0;
              const isFirstObjectiveRow = currentObjective !== previousObjective;
              const objectiveRowspan = countRowsWithSameObjective(record.rows, index);

              return `
                <tr>
                  ${isFirstRow ? `<td class="wc-performance-code" rowspan="${totalRows}">${escapeHtml(record.codeLink)}</td>` : ""}
                  ${isFirstRow ? `<td class="wc-performance-goal" rowspan="${totalRows}">${escapeHtml(record.goal)}</td>` : ""}
                  ${isFirstObjectiveRow ? `<td class="wc-performance-objective" rowspan="${objectiveRowspan}">${escapeHtml(row.objective)}</td>` : ""}
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
