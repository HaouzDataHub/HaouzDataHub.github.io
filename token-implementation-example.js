/**
 * GitHub Token Implementation Example
 * Example of how to implement full GitHub synchronization with sessionStorage
 */

// ====== على الصفحة الرئيسية (Main Application) ======

// 1. عند تحميل الصفحة، تحقق من وجود Token
window.addEventListener('load', () => {
  initializeGithubSync();
});

/**
 * تهيئة نظام مزامنة GitHub
 */
async function initializeGithubSync() {
  const token = sessionStorage.getItem('github_token');
  
  if (!token) {
    // إذا لم يوجد token، اطلب من المستخدم إدخاله
    console.log('Token not found. Opening token input dialog...');
    openTokenInputDialog();
  } else {
    // إذا وجد token، تحقق من صحته
    console.log('Token found. Validating...');
    const isValid = await validateGithubToken(token);
    
    if (isValid) {
      console.log('✅ Token is valid. Starting sync...');
      startAutoSync();
    } else {
      console.error('❌ Token is invalid. Please re-enter.');
      openTokenInputDialog();
    }
  }
}

/**
 * فتح نافذة حوار لإدخال Token
 */
function openTokenInputDialog() {
  // إنشاء نافذة حوار بسيطة
  const token = prompt(
    'أدخل GitHub Personal Access Token:\n\n' +
    '(سيتم حفظه في sessionStorage ويُحذف عند إغلاق المتصفح)',
    ''
  );
  
  if (token && token.trim()) {
    // حفظ الـ Token في sessionStorage
    sessionStorage.setItem('github_token', token.trim());
    sessionStorage.setItem('github_token_created', new Date().toISOString());
    
    console.log('Token saved to sessionStorage');
    
    // تحقق من صحة الـ Token
    validateGithubToken(token).then(isValid => {
      if (isValid) {
        console.log('✅ Token validated successfully!');
        startAutoSync();
        // أظهر رسالة نجاح للمستخدم
        showNotification('✅ Token تم حفظه بنجاح!', 'success');
      } else {
        console.error('❌ Token validation failed');
        sessionStorage.removeItem('github_token');
        showNotification('❌ Token غير صحيح. الرجاء المحاولة مجدداً', 'error');
        openTokenInputDialog();
      }
    });
  }
}

/**
 * التحقق من صحة GitHub Token
 */
async function validateGithubToken(token) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      console.log('✅ GitHub Token is valid');
      return true;
    } else if (response.status === 401) {
      console.error('❌ Unauthorized: Token is invalid or expired');
      return false;
    } else if (response.status === 403) {
      console.error('❌ Forbidden: Insufficient permissions');
      return false;
    } else {
      console.error(`❌ Unexpected error: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// ====== معالجة تحديث المهارات ======

/**
 * معالج تحديث المهارات
 */
async function handleSkillUpdate(updatedSkill) {
  try {
    // 1. تحديث البيانات المحلية
    updateLocalSkillData(updatedSkill);
    console.log('Local skill data updated:', updatedSkill);
    
    // 2. المزامنة مع GitHub
    const token = sessionStorage.getItem('github_token');
    if (token) {
      const allSkills = await getAllSkillsData();
      await updateSkillsOnGitHub(allSkills, token);
      showNotification('✅ تم تحديث المهارات على GitHub', 'success');
    } else {
      console.warn('No token found. Skipping GitHub sync.');
      showNotification('⚠️ لم يتم العثور على token. تحديث محلي فقط.', 'warning');
    }
  } catch (error) {
    console.error('Error updating skill:', error);
    showNotification('❌ حدث خطأ في التحديث', 'error');
  }
}

/**
 * معالج حذف مهارة
 */
async function handleSkillDelete(skillId) {
  try {
    // 1. حذف البيانات المحلية
    deleteLocalSkillData(skillId);
    console.log('Local skill deleted:', skillId);
    
    // 2. المزامنة مع GitHub
    const token = sessionStorage.getItem('github_token');
    if (token) {
      const allSkills = await getAllSkillsData();
      await updateSkillsOnGitHub(allSkills, token);
      showNotification('✅ تم حذف المهارة من GitHub', 'success');
    }
  } catch (error) {
    console.error('Error deleting skill:', error);
    showNotification('❌ حدث خطأ في الحذف', 'error');
  }
}

// ====== المزامنة التلقائية ======

/**
 * بدء المزامنة التلقائية
 */
function startAutoSync() {
  // مزامنة كل 5 دقائق
  setInterval(async () => {
    const token = sessionStorage.getItem('github_token');
    if (token) {
      try {
        const allSkills = await getAllSkillsData();
        await updateSkillsOnGitHub(allSkills, token);
        console.log('✅ Auto-sync completed at:', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// ====== عند تسجيل الخروج ======

/**
 * معالج تسجيل الخروج
 */
function handleLogout() {
  // حذف الـ Token من sessionStorage
  sessionStorage.removeItem('github_token');
  sessionStorage.removeItem('github_token_created');
  
  console.log('✅ Token removed from sessionStorage');
  console.log('Session cleared. Token will not persist on browser restart.');
  
  // إعادة توجيه للصفحة الرئيسية أو تحديث الصفحة
  window.location.reload();
}

// ====== دوال مساعدة ======

/**
 * عرض إخطار للمستخدم
 */
function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // يمكنك إضافة نظام إخطارات مخصص هنا
  // مثلاً: استخدام Toastr أو Sweetalert
  // toastr[type](message);
  
  // أو استخدام alert بسيط
  // alert(message);
}

/**
 * الحصول على جميع بيانات المهارات
 */
async function getAllSkillsData() {
  try {
    const response = await fetch('/skills-data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching skills data:', error);
    return [];
  }
}

/**
 * تحديث بيانات المهارات المحلية
 */
function updateLocalSkillData(updatedSkill) {
  // تحديث البيانات في localStorage أو في الـ DOM
  localStorage.setItem('skillsData', JSON.stringify(
    JSON.parse(localStorage.getItem('skillsData') || '[]').map(skill =>
      skill.id === updatedSkill.id ? updatedSkill : skill
    )
  ));
}

/**
 * حذف بيانات المهارات المحلية
 */
function deleteLocalSkillData(skillId) {
  localStorage.setItem('skillsData', JSON.stringify(
    JSON.parse(localStorage.getItem('skillsData') || '[]').filter(skill =>
      skill.id !== skillId
    )
  ));
}

// ====== أمثلة الاستخدام ======

/*
// مثال 1: تحديث مهارة
const updatedSkill = {
  id: 1,
  title: 'SQL JOIN - Advanced Syntax',
  category: 'SQL',
  description: 'Learn how to perform INNER JOINs...',
  code: 'SELECT a.*, b.column_name FROM table_a a\nINNER JOIN table_b b ON a.id = b.id'
};

handleSkillUpdate(updatedSkill);

// مثال 2: حذف مهارة
handleSkillDelete(1);

// مثال 3: تسجيل الخروج
handleLogout();

// مثال 4: الحصول على Token الحالي
const currentToken = sessionStorage.getItem('github_token');
console.log('Current token:', currentToken);

// مثال 5: التحقق من توقيت إنشاء Token
const tokenCreatedAt = sessionStorage.getItem('github_token_created');
console.log('Token created at:', tokenCreatedAt);
*/

// ====== أحداث إضافية ======

// تحذير عند مغادرة الصفحة
window.addEventListener('beforeunload', (event) => {
  const token = sessionStorage.getItem('github_token');
  if (token) {
    console.log('⚠️ Page is being unloaded. Token will be deleted after session ends.');
  }
});

// عند إعادة التحديث (F5 أو Ctrl+R)
window.addEventListener('beforeunload', () => {
  console.log('📝 Syncing any pending changes before refresh...');
});

console.log('✅ GitHub Token Implementation loaded successfully');
