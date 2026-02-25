const fs = require('fs');
const path = require('path');

const messagesDir = 'c:\\Users\\user\\Desktop\\getyousite-platform\\messages';
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const replacements = [
    { search: /"avg_ai_score":\s*"[^"]*"/g, replace: '"avg_quality_score": "Quality Index"' },
    { search: /AI-Powered/g, replace: 'Systems-Driven' },
    { search: /AI-driven/g, replace: 'Logic-driven' },
    { search: /"intelligence_desc":\s*"AI[^"]*"/g, replace: '"intelligence_desc": "Strategic Lead Analysis & Prioritization"' },
    { search: /"The AI architects/g, replace: '"The Engine synthesizes' },
    { search: /"avg_ai_score"/g, replace: '"avg_quality_score"' },
    { search: /AI Score/g, replace: 'Quality Index' },
    { search: /AI Design Core/g, replace: 'Strategic Synthesis Core' },
    { search: /AI Command/g, replace: 'Command Engine' },
    { search: /AI Pulse/g, replace: 'Engine Pulse' },
];

files.forEach(file => {
    const filePath = path.join(messagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    replacements.forEach(r => {
        content = content.replace(r.search, r.replace);
    });

    // Specific Arabic fixes
    if (file === 'ar.json') {
        content = content.replace(/ذكاء جمالي/g, 'توليف جمالي');
        content = content.replace(/مصفوفة_الذكاء/g, 'مصفوفة_الاستخبارات');
        content = content.replace(/ai-future/g, 'strategic-future');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
