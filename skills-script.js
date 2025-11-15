// Simple render function
function renderSkills() {
  const container = document.getElementById('postsGrid');
  if (!container) return;
  container.innerHTML = '';
  skillsData.forEach(skill => {
    const div = document.createElement('div');
    div.className = 'skill-card';
    div.innerHTML = '<h3>' + skill.title + '</h3><p>' + skill.description + '</p><pre><code>' + skill.code + '</code></pre>';
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', renderSkills);
