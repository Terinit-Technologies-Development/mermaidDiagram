
export const INITIAL_CODE = `graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]`;

export const STORAGE_KEY = 'mermaid_architect_api_key';

export const SYSTEM_PROMPT = `You are a Mermaid.js expert. Your task is to fix the provided Mermaid syntax error. 
Follow these rules:
1. Fix only the syntax errors.
2. Maintain the original logic of the diagram.
3. Return ONLY the raw Mermaid code.
4. Do NOT include markdown code blocks like \`\`\`mermaid or \`\`\`.
5. Do NOT include any explanations or conversational text.`;
