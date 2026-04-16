/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Convert a string to kebab-case
 */
function toKebabCase(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Generate SKILL.md content for text-only skill
 */
function generateTextOnlySkill(skillName, description, purpose, examples) {
  const skillNameKebab = toKebabCase(skillName);
  
  const examplesStr = examples
    .map(ex => `* "${ex}"`)
    .join('\n');

  return `---
name: ${skillNameKebab}
description: ${description}
---

# ${skillName}

${purpose}

## Examples

${examplesStr}

## Instructions

Provide helpful responses using the persona and guidelines above. Engage naturally with the user based on the skill's purpose.
`;
}

/**
 * Generate SKILL.md content for JavaScript skill
 */
function generateJsSkill(skillName, description, purpose, examples) {
  const skillNameKebab = toKebabCase(skillName);
  
  const examplesStr = examples
    .map(ex => `* "${ex}"`)
    .join('\n');

  return `---
name: ${skillNameKebab}
description: ${description}
---

# ${skillName}

${purpose}

## Examples

${examplesStr}

## Instructions

Call the \`run_js\` tool with the following exact parameters:

- script name: \`index.html\`
- data: A JSON string with the following fields:
  - input: The main input parameter for processing
`;
}

/**
 * Generate SKILL.md content for native skill
 */
function generateNativeSkill(skillName, description, purpose, examples) {
  const skillNameKebab = toKebabCase(skillName);
  
  const examplesStr = examples
    .map(ex => `* "${ex}"`)
    .join('\n');

  return `---
name: ${skillNameKebab}
description: ${description}
---

# ${skillName}

${purpose}

## Examples

${examplesStr}

## Instructions

Call the \`run_intent\` tool with the following exact parameters:

- intent: [specify_intent_name]
- parameters: A JSON string with the following fields:
  - [parameter_name]: description of parameter
`;
}

/**
 * Generate index.html for JS skills
 */
function generateJsIndexHtml(skillName) {
  const skillNameKebab = toKebabCase(skillName);
  
  return `<!--
@license
Copyright 2026 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================
-->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${skillName}</title>
  </head>
  <body>
    <script src="index.js"></script>
  </body>
</html>
`;
}

/**
 * Generate index.js for JS skills
 */
function generateJsIndexJs(skillName) {
  return `/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Main skill function - implement your logic here
 */
async function processInput(input) {
  // TODO: Implement your skill logic here
  return \`Processed: \${input}\`;
}

/**
 * Entry point - required by AI Edge Gallery
 * Receives data as stringified JSON and returns stringified JSON result
 */
window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const jsonData = JSON.parse(data);
    const result = await processInput(jsonData.input);

    return JSON.stringify({
      result: result
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({
      error: \`Failed: \${e.message}\`
    });
  }
};
`;
}

/**
 * Generate a complete skill structure
 */
function generateSkill(skillType, skillName, description, purpose, examples) {
  if (!skillName || !description) {
    throw new Error('Skill name and description are required');
  }

  if (!['text-only', 'javascript', 'native'].includes(skillType)) {
    throw new Error('Skill type must be: text-only, javascript, or native');
  }

  const skillNameKebab = toKebabCase(skillName);
  const files = {};

  // Generate SKILL.md
  if (skillType === 'text-only') {
    files[`${skillNameKebab}/SKILL.md`] = generateTextOnlySkill(skillName, description, purpose, examples);
  } else if (skillType === 'javascript') {
    files[`${skillNameKebab}/SKILL.md`] = generateJsSkill(skillName, description, purpose, examples);
    files[`${skillNameKebab}/scripts/index.html`] = generateJsIndexHtml(skillName);
    files[`${skillNameKebab}/scripts/index.js`] = generateJsIndexJs(skillName);
  } else if (skillType === 'native') {
    files[`${skillNameKebab}/SKILL.md`] = generateNativeSkill(skillName, description, purpose, examples);
  }

  return {
    skillName: skillNameKebab,
    skillType: skillType,
    files: files
  };
}

/**
 * Main entry point for AI Edge Gallery
 */
window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const jsonData = JSON.parse(data);
    
    const generated = generateSkill(
      jsonData.skillType || 'text-only',
      jsonData.skillName || 'My Skill',
      jsonData.description || 'A new skill',
      jsonData.purpose || 'This skill provides helpful functionality.',
      jsonData.examples || ['Use this skill for...']
    );

    const fileSummary = Object.keys(generated.files)
      .map(path => \`- \${path}\`)
      .join('\\n');

    return JSON.stringify({
      result: \`✅ Skill '\${generated.skillName}' generated successfully!\\n\\nGenerated files:\\n\${fileSummary}\\n\\nNext steps:\\n1. Review the generated files\\n2. Customize the skill logic\\n3. Test in the Gallery app\\n4. Share with the community!\`,
      files: generated.files,
      skillName: generated.skillName,
      skillType: generated.skillType
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({
      error: \`Failed to generate skill: \${e.message}\`
    });
  }
};
`;