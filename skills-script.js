// Enhanced Skills Script - Modal, Copy, Comments

const CommentSystem = {
  getComments(id) { return JSON.parse(localStorage.getItem('c_'+id) || '[]'); },
  add(id, author, text) {
    let c = this.getComments(id);
    c.push({id:Date.now(), author:author||'Anon', text, date:new Date().toLocaleDateString()});
    localStorage.setItem('c_'+id, JSON.stringify(c));
  },
  delete(id, cid) {
    let c = this.getComments(id).filter(x=>x.id!==cid);
    localStorage.setItem('c_'+id, JSON.stringify(c));
  }
};

function copyCode(code, btn) {
  navigator.clipboard.writeText(code).then(()=>{
    const orig = btn.textContent; btn.textContent = 'Copied!'; btn.classList.add('copied');
    setTimeout(()=>{btn.textContent = orig; btn.classList.remove('copied');}, 1500);
  });
}

function openModal(id) {
  const s = skillsData.find(x=>x.id===id);
  if(!s) return;
  document.getElementById('modalImg').src = s.image;
  document.getElementById('modalTitle').textContent = s.title;
  document.getElementById('modalDesc').textContent = s.description;
  document.getElementById('modalCode').textContent = s.code;
  loadComments(id);
  document.getElementById('cid').value = id;
  document.getElementById('skillModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('skillModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function loadComments(id) {
  const comments = CommentSystem.getComments(id);
  const container = document.getElementById('comments');
  container.innerHTML = comments.length ? '' : '<p style="color:#999">No comments yet</p>';
  comments.forEach(c=>{
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<strong>${c.author}</strong><span class="date">${c.date}</span><p>${c.text}</p><button onclick="delComment(${id},${c.id})">Delete</button>`;
    container.appendChild(div);
  });
}

function submitComment() {
  const id = parseInt(document.getElementById('cid').value);
  const author = document.getElementById('author').value || 'Anonymous';
  const text = document.getElementById('text').value.trim();
  if(!text) return alert('Enter comment');
  CommentSystem.add(id, author, text);
  document.getElementById('text').value = '';
  document.getElementById('author').value = '';
  loadComments(id);
}

function delComment(id, cid) {
  if(confirm('Delete?')) { CommentSystem.delete(id, cid); loadComments(id); }
}

function renderSkills() {
  const container = document.getElementById('postsGrid');
  if (!container) return;
  container.innerHTML = '';
  skillsData.forEach(s=>{
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `<div class="img-wrapper"><img src="${s.image}" alt="${s.title}" class="card-img" onerror="this.style.display='none'"><div class="overlay">${s.icon}</div></div><div class="content"><h3>${s.title}</h3><p>${s.description}</p><code>${s.code.substring(0,100)}...</code><div class="btns"><button class="btn" onclick="openModal(${s.id})">View</button><button class="btn" onclick="copyCode('${s.code.replace(/'/g,"\\'").replace(/\n/g,' ')}', this)">Copy</button></div></div>`;
    container.appendChild(card);
  });
}

function filterCategory(cat) {
  const cards = document.querySelectorAll('.skill-card');
  cards.forEach((card, i)=>{
    card.style.display = (cat==='all'||skillsData[i].category===cat) ? 'block':'none';
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderSkills();
  document.querySelectorAll('.filter-btn').forEach(b=>b.onclick=()=>filterCategory(b.dataset.cat));
  document.getElementById('skillModal').onclick=(e)=>e.target.id==='skillModal'&&closeModal();
});
