import { fetchJSON, renderProjects, fetchGitHubData} from './global.js'; //no fetchGithubData????
const projects = await fetchJSON('./projects/lib/projects.json'); //changed??? index.js position correct???
const githubData = await fetchGitHubData('BaoyiWan');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
const profileStats = document.querySelector('#profile-stats');
renderProjects(latestProjects, projectsContainer, 'h2');

if (profileStats) { //change when updated each time?
  profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>8</dd>
          <dt>Public Gists:</dt><dd>0</dd> 
          <dt>Followers:</dt><dd>0</dd>
          <dt>Following:</dt><dd>0</dd>
        </dl>
    `;
}