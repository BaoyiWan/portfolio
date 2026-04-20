console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/*
const navLinks = $$("nav a");

let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

currentLink?.classList.add('current');
if (currentLink) {
  // or if (currentLink !== undefined)
  currentLink.classList.add('current');
}
*/

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'cv/', title: 'CV' },
  { url: 'https://github.com/BaoyiWan/', title: 'Profile'}
  // add the rest of your pages here
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name


for (let p of pages) {
  let url = p.url;
  let title = p.title;
  if (!url.startsWith('http')) {
    //console.log(BASE_PATH)
    //console.log(url)
    url = BASE_PATH + url;
  }
  // next step: create link and add it to nav
  //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

//console.log(a)
//console.log('hello')
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`,
);

const select = document.querySelector('.color-scheme select');

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}
select.addEventListener('input', function (event) {
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
  console.log('color scheme changed to', event.target.value);
});

const form = document.querySelector("form");

form?.addEventListener('submit', function (event) {
  event.preventDefault(); 

  const data = new FormData(form);

  let url = form.action + "?"; 

  let params = [];

  for (let [name, value] of data) {
    params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  }

  url += params.join("&");

  console.log(url); // debug

  location.href = url; 
});


export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    console.log(response);
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach(project => { //loop like this???
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${project.title}</h3>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  });
}
