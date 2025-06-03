function getFlagImg(countryName) {
  const countryCodeMap = {
    "Brazil": "BR",
    "Portugal": "PT",
    "Egypt": "EG",
    "United States": "US",
    "France": "FR",
    "Spain": "ES",
    "Germany": "DE",
    "New Zealand": "NZ",
    "Argentina": "AR",
    "Tunisia": "TN",
    "England": "GB",
    "Japan": "JP",
    "Mexico": "MX",
    "Italy": "IT",
    "South Korea": "KR",
    "South Africa": "ZA",
    "Morocco": "MA",
    "United Arab Emirates": "AE",
    "Saudi Arabia": "SA",
    "Austria": "AT"
  };

  const code = countryCodeMap[countryName];
  if (!code) return "";
  return `<img src="https://flagcdn.com/w40/${code.toLowerCase()}.png" alt="${countryName} flag" style="width: 20px; vertical-align: middle; margin-right: 4px;">`;
}

const selectedTeams = {};

function updateFooter(totalGroups) {
  const footerContainer = document.getElementById("selected-teams");
  footerContainer.innerHTML = "";
  Object.values(selectedTeams).forEach(team => {
    const img = document.createElement("img");
    img.src = team.logosrc;
    img.alt = team.TeamName;
    img.onerror = function() { this.onerror = null; this.src = 'img/logos/default.png'; };
    footerContainer.appendChild(img);
  });
  document.getElementById("selected-count").textContent = `${Object.keys(selectedTeams).length}/${totalGroups} selected`;
  const submitButton = document.getElementById("submit-button");
  submitButton.disabled = Object.keys(selectedTeams).length !== totalGroups;
}

fetch('teams.json')
  .then(response => response.json())
  .then(teams => {
    const groupsContainer = document.getElementById("groups-container");
    const groups = {};

    // Group teams by group letter
    teams.forEach(team => {
      if (!groups[team.group]) groups[team.group] = [];
      groups[team.group].push(team);
    });

    const totalGroups = Object.keys(groups).length;
    updateFooter(totalGroups);

    for (const group in groups) {
      const section = document.createElement("div");
      section.classList.add("group");

      const title = document.createElement("h2");
      title.textContent = `Group ${group}`;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.classList.add("team-grid");

      groups[group].forEach(team => {
        const card = document.createElement("div");
        card.classList.add("team-card");
        card.innerHTML = `
          <img src="${team.logosrc}" alt="${team.TeamName}" onerror="this.onerror=null;this.src='img/logos/default.png';">
          <div><strong>${team.TeamName}</strong></div>
          <div>${getFlagImg(team.Country)}${team.Country}</div>
        `;

        // Click handler: toggle selection, keep others grayed out
        card.addEventListener("click", () => {
          const cards = grid.querySelectorAll(".team-card");
          const isAlreadySelected = card.classList.contains("selected");

          // Clear all states
          cards.forEach(c => c.classList.remove("selected", "disabled"));

          if (!isAlreadySelected) {
            // Select new card and gray out others
            card.classList.add("selected");
            selectedTeams[group] = team;
            cards.forEach(c => {
              if (!c.classList.contains("selected")) {
                c.classList.add("disabled");
              }
            });
          } else {
            delete selectedTeams[group];
          }

          updateFooter(totalGroups);
        });

        grid.appendChild(card);
      });

      section.appendChild(grid);
      groupsContainer.appendChild(section);
    }
  })
  .catch(err => {
    console.error("Failed to load teams.json", err);
  });
