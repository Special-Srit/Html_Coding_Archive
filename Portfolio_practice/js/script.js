// GitHub Projects Integration
const GITHUB_USERNAME = 'Special-Srit'; // Replace with your GitHub username

// Language to icon mapping
const languageIcons = {
    'JavaScript': 'fab fa-js-square',
    'TypeScript': 'fab fa-js-square',
    'Python': 'fab fa-python',
    'React': 'fab fa-react',
    'Vue': 'fab fa-vuejs',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'Java': 'fab fa-java',
    'PHP': 'fab fa-php',
    'Ruby': 'fas fa-gem',
    'Go': 'fas fa-code',
    'Rust': 'fas fa-cog',
    'C++': 'fas fa-code',
    'C': 'fas fa-code',
    'Shell': 'fas fa-terminal',
    'Jupyter Notebook': 'fas fa-chart-bar',
    'default': 'fas fa-code'
};

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            throw new Error('GitHub API request failed');
        }

        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayFallbackProjects();
    }
}

function displayProjects(repos) {
    const container = document.getElementById('projects-container');
    const loading = document.getElementById('loading');

    // Remove loading state
    loading.remove();

    // Filter out forks and empty repos, get top 3
    const filteredRepos = repos
        .filter(repo => !repo.fork && repo.description)
        .slice(0, 3);

    filteredRepos.forEach(repo => {
        const projectCard = createProjectCard(repo);
        container.appendChild(projectCard);
    });
}

function createProjectCard(repo) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';

    const iconClass = languageIcons[repo.language] || languageIcons['default'];
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();

    col.innerHTML = `
                <div class="card project-card">
                    <div class="project-img">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="project-content">
                        <h4 class="mb-3" style="color: var(--lavender-accent);">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p class="mb-3">${repo.description || 'No description available.'}</p>
                        <div class="project-stats">
                            <i class="fas fa-star"></i>${repo.stargazers_count}
                            <i class="fas fa-code-branch ms-3"></i>${repo.forks_count}
                            <i class="fas fa-clock ms-3"></i>Updated ${updatedDate}
                        </div>
                        ${repo.language ? `<div class="mb-3"><span class="language-badge">${repo.language}</span></div>` : ''}
                        <div class="project-meta">
                            <a href="${repo.html_url}" target="_blank" class="btn-lavender me-2">
                                <i class="fab fa-github me-1"></i>View Code
                            </a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn-lavender">Live Demo</a>` : ''}
                        </div>
                    </div>
                </div>
            `;

    return col;
}

function displayFallbackProjects() {
    const container = document.getElementById('projects-container');
    const loading = document.getElementById('loading');

    loading.innerHTML = `
                <div class="col-12 text-center">
                    <p style="color: var(--text-secondary);">
                        Unable to load projects from GitHub. Please check the username or try again later.
                        <br><br>
                        <strong>To set up GitHub integration:</strong><br>
                        1. Replace 'yourusername' with your GitHub username in the code<br>
                        2. Make sure your repositories are public<br>
                        3. Add descriptions to your repositories for better display
                    </p>
                </div>
            `;
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchGitHubProjects();
});