import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
//GPUDeviceLostInfo.console(projects)
const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `Projects (${projects.length})`;

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

/*
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);
console.log(rolledData);


let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})

let legend = d3.select('.legend');
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .attr('class', 'legend-item')
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // TODO: filter the projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // TODO: render updated projects!
  renderProjects(filteredProjects, projectsContainer, 'h2');
});
*/

// Refactor all plotting into one function
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let currentData = [];
let selectedIndex = -1;
let query = ''; //add1
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year }; // TODO
  });
  currentData = newData;
  // re-calculate slice generator, arc data, arc, etc.
  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData); 
  let newArcs = newArcData.map((d) => newArcGenerator(d)); 
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  // TODO: clear up paths and legends
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();
  // update paths and legends, refer to steps 1.4 and 2.2
  newArcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
      .attr('class', idx === selectedIndex ? 'selected' : '') //add4
      .on('click', () => {
      // What should we do? (Keep scrolling to find out!)
      selectedIndex = selectedIndex === idx ? -1 : idx;
      svg.selectAll('path')
          .attr('class', (_, idx) =>
            // TODO: filter idx to find correct pie slice and apply CSS from above
            idx === selectedIndex ? 'selected' : ''
          );
      legend.selectAll('li')
          .attr('class', (_, idx) =>
            // TODO: filter idx to find correct legend and apply CSS from above
            idx === selectedIndex ? 'selected' : 'legend-item'
          );
      // if (selectedIndex === -1) {
      //     renderProjects(projectsGiven, projectsContainer, 'h2');
      //   } else {
      //     let selectedYear = currentData[selectedIndex].label;
      //     let filtered = projectsGiven.filter(p =>    
      //       p.year === selectedYear
      //     );
      //     renderProjects(filtered, projectsContainer, 'h2'); 
      //   }
        applyFilters();//revise3
    });
  })


  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      //.attr('class', 'legend-item')
      .attr('class', idx === selectedIndex ? 'selected' : 'legend-item') //add5
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });
}

//revise3
function applyFilters() {
  let filteredProjects = projects.filter((project) => {
    let matchSearch = Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
    
    if (selectedIndex === -1) {
      return matchSearch;
    } else {
      let selectedYear = currentData[selectedIndex].label;
      return matchSearch && project.year === selectedYear;
    }
  });
  renderProjects(filteredProjects, projectsContainer, 'h2');
}


let searchInput = document.querySelector('.searchBar');
renderPieChart(projects);
renderProjects(projects, projectsContainer, 'h2');

searchInput.addEventListener('input', (event) => {
  // update query value
  query = event.target.value; //revise5
  // TODO: filter the projects
  let selectedLabel = selectedIndex !== -1 ? currentData[selectedIndex]?.label : null;//add5

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  //selectedIndex = -1; revise2
  // re-render legends and pie chart when event triggers
  //renderProjects(filteredProjects, projectsContainer, 'h2'); revise4
  renderPieChart(filteredProjects);

  if (selectedLabel) {
    selectedIndex = currentData.findIndex(d => d.label === selectedLabel);
  }
  
  applyFilters();//revise3
});



