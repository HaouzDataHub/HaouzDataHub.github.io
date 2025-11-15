// Skills Data - Example posts for SQL, Python, R, Tableau, Excel

var skillsData = [
    {
        id: 1,
        title: 'SQL JOIN - Basic Syntax',
        category: 'sql',
        code: 'SELECT a.*, b.column_name\nFROM table_a a\nINNER JOIN table_b b\n  ON a.id = b.a_id\nWHERE a.date > "2024-01-01"\nORDER BY a.created_at DESC;',
        description: 'Learn how to perform INNER JOINs to combine data from multiple tables efficiently. This example joins two tables on matching IDs and filters by date.',
        image: ''
    },
    {
        id: 2,
        title: 'SQL GROUP BY & AGGREGATE',
        category: 'sql',
        code: 'SELECT \n    category,\n    COUNT(*) as total_count,\n    AVG(amount) as average_amount,\n    MAX(amount) as max_amount\nFROM sales\nGROUP BY category\nHAVING COUNT(*) > 5\nORDER BY total_count DESC;',
        description: 'Master GROUP BY clauses with aggregate functions to summarize data by categories.',
        image: ''
    },
    {
        id: 3,
        title: 'SQL Window Functions',
        category: 'sql',
        code: 'SELECT \n    id,\n    name,\n    salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank,\n    AVG(salary) OVER (PARTITION BY department) as dept_avg\nFROM employees;',
        description: 'Advanced SQL using window functions like ROW_NUMBER() and AVG() for complex analytics without GROUP BY.',
        image: ''
    },
    {
        id: 4,
        title: 'Python Data Cleaning',
        category: 'python',
        code: 'import pandas as pd\n\n# Load data\ndf = pd.read_csv("data.csv")\n\n# Remove duplicates\ndf = df.drop_duplicates()\n\n# Fill missing values\ndf["age"] = df["age"].fillna(df["age"].median())\n\n# Remove outliers\nQ1 = df["salary"].quantile(0.25)\nQ3 = df["salary"].quantile(0.75)\nIQR = Q3 - Q1\ndf = df[(df["salary"] >= Q1 - 1.5*IQR) & (df["salary"] <= Q3 + 1.5*IQR)]',
        description: 'Essential data cleaning techniques in Python using Pandas: removing duplicates, handling missing values, and eliminating outliers.',
        image: ''
    },
    {
        id: 5,
        title: 'Python Data Visualization',
        category: 'python',
        code: 'import matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Create multiple subplots\nfig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\n# Scatter plot\naxes[0, 0].scatter(df["age"], df["salary"], alpha=0.6)\naxes[0, 0].set_title("Age vs Salary")\n\n# Histogram\naxes[0, 1].hist(df["age"], bins=30, edgecolor="black")\naxes[0, 1].set_title("Age Distribution")\n\n# Box plot\nsns.boxplot(data=df, x="department", y="salary", ax=axes[1, 0])\naxes[1, 0].set_title("Salary by Department")\n\nplt.tight_layout()\nplt.show()',
        description: 'Create professional visualizations with Matplotlib and Seaborn for data exploration and insights.',
        image: ''
    },
    {
        id: 6,
        title: 'R ggplot2 Visualization',
        category: 'r',
        code: 'library(ggplot2)\nlibrary(dplyr)\n\n# Prepare data\ndf_summary <- df %>%\n  group_by(category) %>%\n  summarise(avg_value = mean(value, na.rm = TRUE))\n\n# Create visualization\nggplot(df_summary, aes(x = category, y = avg_value, fill = category)) +\n  geom_bar(stat = "identity") +\n  geom_text(aes(label = round(avg_value, 2)), vjust = -0.5) +\n  theme_minimal() +\n  labs(title = "Average Values by Category",\n       x = "Category", y = "Average Value")',
        description: 'Create publication-ready visualizations using ggplot2, the most popular R visualization package.',
        image: ''
    },
    {
        id: 7,
        title: 'R Statistical Testing',
        category: 'r',
        code: 'library(tidyverse)\n\n# T-test: Compare means of two groups\nresult <- t.test(group1$value, group2$value)\nprint(result)\n\n# ANOVA: Compare means across multiple groups\nresult_anova <- aov(value ~ category, data = df)\nsummary(result_anova)\n\n# Chi-square test: Test independence of categorical variables\ncontingency_table <- table(df$var1, df$var2)\nchi_square_result <- chisq.test(contingency_table)',
        description: 'Perform statistical hypothesis testing in R to validate your data insights.',
        image: ''
    },
    {
        id: 8,
        title: 'Tableau Dashboard Best Practices',
        category: 'tableau',
        code: '// Tableau Calculation Example:\n// 1. Create Calculated Field: Year-over-Year Growth\n(SUM([Sales]) - LOOKUP(SUM([Sales]), -1)) / LOOKUP(SUM([Sales]), -1)\n\n// 2. Table Calculation: Running Total\nRUNNING_SUM(SUM([Sales]))\n\n// 3. Create Parameter for Filter:\nIF [Parameter] = "Option1" THEN [Field1]\nELSIF [Parameter] = "Option2" THEN [Field2]\nELSE [Field3]\nEND',
        description: 'Master Tableau calculated fields, parameters, and LOD expressions for advanced dashboard functionality.',
        image: ''
    },
    {
        id: 9,
        title: 'Excel VLOOKUP & Advanced Formulas',
        category: 'excel',
        code: '// VLOOKUP Example:\n=VLOOKUP(A2, Database!$A$1:$D$100, 3, FALSE)\n\n// INDEX-MATCH Combination (more flexible than VLOOKUP):\n=INDEX(Database!$C$1:$C$100, MATCH(A2, Database!$A$1:$A$100, 0))\n\n// SUMPRODUCT for Complex Calculations:\n=SUMPRODUCT((Database!$B$2:$B$100="Category1")*(Database!$C$2:$C$100>100)*Database!$D$2:$D$100)',
        description: 'Advanced Excel formulas including VLOOKUP, INDEX-MATCH, and SUMPRODUCT for data analysis.',
        image: ''
    },
    {
        id: 10,
        title: 'Excel Pivot Tables',
        category: 'excel',
        code: '// Creating a Pivot Table in Excel:\n// 1. Select data range (Ctrl+A)\n// 2. Insert > Pivot Table\n// 3. Choose: Rows > Date, Columns > Category\n// 4. Values > SUM(Amount)\n// 5. Apply filters and formatting\n\n// Alternative using VBA:\nActiveSheet.PivotTables.Add Source:=SourceData,\nDestination:=ws.Range("A1"), TableName:="MyPivot"',
        description: 'Create and customize pivot tables for quick data summarization and analysis in Excel.',
        image: ''
    }
];

// Initialize skills from local storage or default data
function loadSkills() {
    const storedSkills = localStorage.getItem('skillsPosts');
    return storedSkills ? JSON.parse(storedSkills) : skillsData;
}

// Save skills to local storage
function saveSkills(skills) {
    localStorage.setItem('skillsPosts', JSON.stringify(skills));
}

// Add new skill
function addSkill(skillPost) {
    let skills = loadSkills();
    skillPost.id = Math.max(...skills.map(s => s.id), 0) + 1;
    skillPost.id = skillPost.id || Date.now();
    skills.unshift(skillPost); // Add to beginning
    saveSkills(skills);
    return skills;
}

// Delete skill
function deleteSkill(skillId) {
    let skills = loadSkills();
    skills = skills.filter(skill => skill.id !== skillId);
    saveSkills(skills);
    return skills;
}

// Filter skills by category
function filterSkillsByCategory(category) {
    const skills = loadSkills();
    if (category === 'all') return skills;
    return skills.filter(skill => skill.category === category);
}
