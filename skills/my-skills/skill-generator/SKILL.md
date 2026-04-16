---
name: skill-generator
description: Interactive skill generator that helps you create new AI Edge Gallery skills with proper structure and boilerplate code.
---

# Skill Generator

This skill helps you generate new skills for the AI Edge Gallery. It provides an interactive interface to scaffold text-only, JavaScript, or native skills.

## Features

- **Interactive Form**: Answer a few questions about your skill
- **Automatic Scaffolding**: Generates proper directory structure
- **Template Generation**: Creates starter code with best practices
- **Validation**: Ensures kebab-case naming and valid configurations
- **Download Ready**: Returns all files formatted for immediate use

## Examples

* "Generate a new skill"
* "Create a text-only skill for..."
* "Help me scaffold a JS skill"
* "Build a new native skill"

## Instructions

Call the `run_js` tool with the following exact parameters:

- script name: `index.html`
- data: A JSON string with the following fields:
  - action: "generate" (to create a new skill)
  - skillType: "text-only", "javascript", or "native" (skill type)
  - skillName: Human-readable name (will be converted to kebab-case)
  - description: Brief description of what the skill does
  - purpose: Detailed explanation of the skill's purpose
  - examples: Array of example prompts that should trigger this skill

The skill returns a JSON object with:
- result: Success message
- files: Object containing all generated files with their paths and content
