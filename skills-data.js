// ============================================
// Skills Data Management System (ENHANCED)
// Supports: Default Data, LocalStorage, Export/Import
// ============================================

// Default Skills Data - ALWAYS AVAILABLE
const defaultSkillsData = [
  {
    id: 1,
    title: 'SQL JOIN - Basic Syntax',
    category: 'sql',
    code: 'SELECT a.*, b.column_name\nFROM table_a a\nINNER JOIN table_b b ON a.id = b.a_id\nWHERE a.date > "2024-01-01"\nORDER BY a.created_at DESC;',
    description: 'Learn how to perform INNER JOINs to combine data from multiple tables efficiently. This example joins two tables on matching column values.',
    image: ''
  },
  {
    id: 2,
    title: 'SQL GROUP BY & AGGREGATE',
    category: 'sql',
    code: 'SELECT\n  category,\n  COUNT(*) as total_count,\n  AVG(amount) as average_amount,\n  MAX(amount) as max_amount\nFROM sales\nGROUP BY category;',
    description: 'Master GROUP BY clauses with aggregate functions to summarize data by categories.',
    image: ''
  },
  {
    id: 3,
    title: 'SQL Window Functions',
    category: 'sql',
    code: 'SELECT\n  id,\n  name,\n  salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank,\n  AVG(salary) OVER (PARTITION BY department) as dept_avg\nFROM employees;',
    description: 'Advanced SQL using window functions like ROW_NUMBER() and AVG() for complex analytics without GROUP BY.',
    image: ''
  },
  {
    id: 4,
    title: 'Python Data Cleaning',
    category: 'python',
    code: 'import pandas as pd\n\ndf = pd.read_csv("data.csv")\ndf = df.drop_duplicates()\ndf = df.fillna(method="ffill")\ndf[\'date\'] = pd.to_datetime(df[\'date\'])\ndf.to_csv("cleaned_data.csv", index=False)',
    description: 'Essential data cleaning techniques in Python using Pandas: removing duplicates, handling missing values, converting types.',
    image: ''
  },
  {
    id: 5,
    title: 'Python Data Visualization',
    category: 'python',
    code: 'import matplotlib.pyplot as plt\nimport seaborn as sns\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 8))\ndata.plot(kind="line", ax=axes[0, 0])\ndata.plot(kind="scatter", ax=axes[0, 1])\nsns.heatmap(corr_matrix, ax=axes[1, 0])\nplt.tight_layout()\nplt.show()',
    description: 'Create professional visualizations with Matplotlib and Seaborn for data exploration.',
    image: ''
  },
  {
    id: 6,
    title: 'R ggplot2 Visualization',
    category: 'r',
    code: 'library(ggplot2)\nlibrary(dplyr)\n\nggplot(data = df, aes(x = var1, y = var2, color = category)) +\n  geom_point(size = 3, alpha = 0.7) +\n  geom_smooth(method = "lm") +\n  theme_minimal() +\n  labs(title = "Scatter Plot with Trend Line")',
    description: 'Create publication-ready visualizations using ggplot2, the most popular R visualization package.',
    image: ''
  }
];

// ============================================
// Skills Manager Class
// ============================================
class SkillsManager {
  constructor() {
    this.storageKey = 'haouzDataHub_skills_v2';
    this.init();
  }

  init() {
    // Initialize with default data if storage is empty
    if (!this.getFromStorage()) {
      this.saveToStorage(defaultSkillsData);
    }
  }

  // Save to LocalStorage
  saveToStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.logAction('Data saved to LocalStorage', data.length);
      return true;
    } catch (error) {
      console.error('Error saving to LocalStorage:', error);
      return false;
    }
  }

  // Get from LocalStorage
  getFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading from LocalStorage:', error);
      return null;
    }
  }

  // Get all skills (merged default + custom)
  getAllSkills() {
    const stored = this.getFromStorage() || defaultSkillsData;
    return stored;
  }

  // Add new skill
  addSkill(skill) {
    const skills = this.getAllSkills();
    const newSkill = {
      id: Math.max(...skills.map(s => s.id), 0) + 1,
      ...skill,
      createdAt: new Date().toISOString()
    };
    skills.push(newSkill);
    this.saveToStorage(skills);
    this.logAction('Skill added', newSkill.title);
    return newSkill;
  }

  // Update skill
  updateSkill(id, updates) {
    const skills = this.getAllSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index !== -1) {
      skills[index] = { ...skills[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(skills);
      this.logAction('Skill updated', skills[index].title);
      return skills[index];
    }
    return null;
  }

  // Delete skill
  deleteSkill(id) {
    const skills = this.getAllSkills();
    const filtered = skills.filter(s => s.id !== id);
    this.saveToStorage(filtered);
    this.logAction('Skill deleted', id);
    return filtered;
  }

  // Reset to defaults
  resetToDefaults() {
    this.saveToStorage(defaultSkillsData);
    this.logAction('Reset to default skills', defaultSkillsData.length);
  }

  // Export skills as JSON
  exportAsJSON() {
    const skills = this.getAllSkills();
    const dataStr = JSON.stringify(skills, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HaouzDataHub_Skills_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.logAction('Skills exported', skills.length);
  }

  // Import skills from JSON
  importFromJSON(jsonData) {
    try {
      const imported = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (Array.isArray(imported)) {
        this.saveToStorage(imported);
        this.logAction('Skills imported', imported.length);
        return true;
      }
    } catch (error) {
      console.error('Error importing skills:', error);
    }
    return false;
  }

  // Filter by category
  filterByCategory(category) {
    return this.getAllSkills().filter(s => s.category === category);
  }

  // Get skill by ID
  getSkillById(id) {
    return this.getAllSkills().find(s => s.id === id);
  }

  // Search skills
  search(query) {
    const q = query.toLowerCase();
    return this.getAllSkills().filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  }

  // Logging for debugging
  logAction(action, details) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${action}:`, details);
  }

  // Get statistics
  getStats() {
    const skills = this.getAllSkills();
    const categories = {};
    skills.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    return {
      totalSkills: skills.length,
      byCategory: categories,
      lastUpdated: localStorage.getItem('haouzDataHub_lastUpdate') || 'Never'
    };
  }
}

// ============================================
// Initialize Manager
// ============================================
const skillsManager = new SkillsManager();

// Expose to global scope for backward compatibility
var skillsData = skillsManager.getAllSkills();
var ADMIN_PASSWORD = 'admin123'; // Should be changed!

// Auto-update on storage changes (for cross-tab sync - partial)
window.addEventListener('storage', (e) => {
  if (e.key === skillsManager.storageKey) {
    skillsData = skillsManager.getAllSkills();
    console.log('Skills updated from another tab');
    if (typeof renderSkills === 'function') {
      renderSkills();
    }
  }
});

console.log('Skills Data Manager loaded. Available methods:');
console.log('- skillsManager.getAllSkills()');
console.log('- skillsManager.addSkill(skill)');
console.log('- skillsManager.updateSkill(id, updates)');
console.log('- skillsManager.deleteSkill(id)');
console.log('- skillsManager.exportAsJSON()');
console.log('- skillsManager.resetToDefaults()');
console.log('- skillsManager.getStats()');
console.log('Stats:', skillsManager.getStats());


// Expose defaultSkillsData to global scope for backward compatibility
window.defaultSkillsData = defaultSkillsData;
