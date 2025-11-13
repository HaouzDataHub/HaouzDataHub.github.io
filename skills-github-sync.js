// ================================================
// GITHUB SYNC - مزامنة البيانات مع GitHub
// ================================================

// إعدادات GitHub API
const GITHUB_OWNER = 'HaouzDataHub';
const GITHUB_REPO = 'HaouzDataHub.github.io';
const GITHUB_FILE = 'skills-data.json';
const GITHUB_BRANCH = 'main';

// تحديث بيانات المهارات على GitHub
async function updateSkillsOnGitHub(skillsArray, token = null) {
  try {
    // إذا لم يكن هناك token، سنحفظ في localStorage فقط
    if (!token) {
      console.warn('لا يوجد GitHub token. سيتم الحفظ في localStorage فقط');
      localStorage.setItem('skillsPosts', JSON.stringify(skillsArray));
      return true;
    }

    // احصل على SHA الحالي للملف
    const currentFileUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
    const currentFileResponse = await fetch(currentFileUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!currentFileResponse.ok) {
      throw new Error('فشل في الحصول على معلومات الملف من GitHub');
    }

    const currentFileData = await currentFileResponse.json();
    const sha = currentFileData.sha;
    const fileContent = btoa(JSON.stringify(skillsArray, null, 2));

    // قم بتحديث الملف على GitHub
    const updateUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'chore: Update skills data from admin panel',
        content: fileContent,
        sha: sha,
        branch: GITHUB_BRANCH
      })
    });

    if (!updateResponse.ok) {
      throw new Error('فشل في تحديث الملف على GitHub');
    }

    // احفظ أيضاً في localStorage
    localStorage.setItem('skillsPosts', JSON.stringify(skillsArray));
    console.log('تم تحديث البيانات على GitHub بنجاح!');
    return true;
  } catch (error) {
    console.error('خطأ في تحديث GitHub:', error);
    localStorage.setItem('skillsPosts', JSON.stringify(skillsArray));
    return false;
  }
}

// دالة محسّنة للحفظ
async function saveSkills(skillsArray, token = null) {
  try {
    if (token && token.trim()) {
      const success = await updateSkillsOnGitHub(skillsArray, token);
      if (success) return true;
    }
    localStorage.setItem('skillsPosts', JSON.stringify(skillsArray));
    cachedSkills = skillsArray;
    return true;
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    return false;
  }
}

// ================================================
// TOKEN MANAGEMENT
// ================================================

function requestGitHubToken() {
  const token = prompt(
    'لتفعيل المزامنة بين الزوار:\n\nأدخل GitHub Personal Access Token\n(https://github.com/settings/tokens)'
  );
  
  if (token && token.trim()) {
    sessionStorage.setItem('githubToken', token);
    alert('تم حفظ GitHub Token بنجاح!');
    return token;
  }
  return null;
}

function getGitHubToken() {
  return sessionStorage.getItem('githubToken') || null;
}

function deleteGitHubToken() {
  sessionStorage.removeItem('githubToken');
}

// عند تسجيل الدخول، اطلب GitHub Token
if (window.checkAdminAccess) {
  const originalCheckAdmin = window.checkAdminAccess;
  window.checkAdminAccess = function() {
    const wasAdmin = isAdmin;
    originalCheckAdmin();
    
    // إذا أصبح مسئول بعد عدم أن يكون رانيا
    if (isAdmin && !wasAdmin && !getGitHubToken()) {
      setTimeout(() => {
        const response = confirm(
          'هل تريد حفظ التعديلات مباشرة على GitHub\n(\u0633\u064aراها الزوار فورا\u064b)'
        );
        if (response) requestGitHubToken();
      }, 300);
    }
  };
}

// عند تسجيل الخروج، احذف Token
if (window.logoutAdmin) {
  const originalLogout = window.logoutAdmin;
  window.logoutAdmin = function() {
    deleteGitHubToken();
    originalLogout();
  };
}
