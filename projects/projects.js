import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
//GPUDeviceLostInfo.console(projects)
const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `Projects (${projects.length})`;

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

//let projects = ...; // fetch your project data ???
// let rolledData = d3.rollups(
//   projects,
//   (v) => v.length,
//   (d) => d.year,
// );
// console.log(rolledData);

// let data = rolledData.map(([year, count]) => {
//   return { value: count, label: year };
// });

// let arc = arcGenerator({
//   startAngle: 0,
//   endAngle: 2 * Math.PI,
// });
//d3.select('svg').append('path').attr('d', arc).attr('fill', 'red'); delete this???
//let data = [1, 2];
// let data = [
//   { value: 1, label: 'apples' },
//   { value: 2, label: 'oranges' },
//   { value: 3, label: 'mangos' },
//   { value: 4, label: 'pears' },
//   { value: 5, label: 'limes' },
//   { value: 5, label: 'cherries' },
// ];
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// let total = 0;

// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// let arcs = arcData.map((d) => arcGenerator(d));
// arcs.forEach((arc) => {
//   // TODO, fill in step for appending path to svg using D3
//   d3.select('svg') //reverse direction???
//   .append('path')
//   .attr('d', arc)
//   .attr('fill', 'red');
// });

//let colors = ['gold', 'purple'];
// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors[idx % colors.length]); // Fill in the attribute for fill color via indexing the colors variable
// })

// arcData.forEach((d, i) => {
//   d3.select('#projects-plot')
//     .append('path')
//     .attr('d', arcGenerator(d))
//     .attr('fill', colors(i));
// });

// let legend = d3.select('.legend'); //why my output colors looks so different????
// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//     .attr('class', 'legend-item')
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// });

let query = '';
let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('change', (event) => {
//   // update query value
//   query = event.target.value;
//   // TODO: filter the projects
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   // TODO: render updated projects!
//   renderProjects(filteredProjects, projectsContainer, 'h2');
// });

let selectedIndex = -1;
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => ({
    value: count, label: year 
  }));

  // re-calculate slice generator, arc data, arc, etc.

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  // TODO: clear up paths and legends
//   let svg = d3.select('#projects-plot');
//   svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();
  let newSVG = d3.select('#projects-plot'); //svg???
  newSVG.selectAll('path').remove();

  newArcData.forEach((d, i) => {
    newSVG.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      //.attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        // What should we do? (Keep scrolling to find out!)
        selectedIndex = selectedIndex === i ? -1 : i;
        newSVG.selectAll('path')
          .attr('class', (_, idx) =>
            // TODO: filter idx to find correct pie slice and apply CSS from above
            idx === selectedIndex ? 'selected' : ''
          );
        legend.selectAll('li')
          .attr('class', (_, idx) =>
            // TODO: filter idx to find correct legend and apply CSS from above
            idx === selectedIndex ? 'selected' : 'legend-item'
          );
      });
  });


  // update paths and legends, refer to steps 1.4 and 2.2
  newArcData.forEach((d, i) => {
    newSVG.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i));
  });
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });
}

// Call this function on page load
renderPieChart(projects);

searchInput.addEventListener('change', (event) => {
  // update query value
  //let filteredProjects = setQuery(event.target.value); setQuery does not exist???
  query = event.target.value;
  // TODO: filter the projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  if (selectedIndex === -1) {
    renderProjects(projects, projectsContainer, 'h2');
  } else {
    // TODO: filter projects and project them onto webpage
    // Hint: `.label` might be useful
    const selectedYear = slices[selectedIndex].label;
    const filteredProjects = projects.filter(project => {
        return project.year === selectedYear; 
    });
  }
  // re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});


