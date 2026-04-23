import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('./lib/projects.json'); //change???
//GPUDeviceLostInfo.console(projects)
const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `Projects (${projects.length})`;

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
