import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Simple code generation based on prompt
    const detectedLanguage = language || detectLanguage(prompt);
    const generatedCode = generateCodeFromPrompt(prompt, detectedLanguage);

    return NextResponse.json({
      code: generatedCode,
      language: detectedLanguage,
    });
  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}

function detectLanguage(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('python') || lower.includes('py')) return 'python';
  if (lower.includes('javascript') || lower.includes('js')) return 'javascript';
  if (lower.includes('typescript') || lower.includes('ts')) return 'typescript';
  if (lower.includes('java')) return 'java';
  if (lower.includes('c++') || lower.includes('cpp')) return 'cpp';
  if (lower.includes('go') || lower.includes('golang')) return 'go';
  if (lower.includes('rust')) return 'rust';
  if (lower.includes('html')) return 'html';
  if (lower.includes('css')) return 'css';
  if (lower.includes('sql')) return 'sql';
  
  return 'javascript'; // default
}

function generateCodeFromPrompt(prompt: string, language: string): string {
  // This is a mock implementation. In production, this would call an AI model
  const templates: Record<string, string> = {
    python: `# Generated Python code for: ${prompt}\n\ndef main():\n    # TODO: Implement logic\n    pass\n\nif __name__ == "__main__":\n    main()`,
    javascript: `// Generated JavaScript code for: ${prompt}\n\nfunction main() {\n  // TODO: Implement logic\n}\n\nmain();`,
    typescript: `// Generated TypeScript code for: ${prompt}\n\nfunction main(): void {\n  // TODO: Implement logic\n}\n\nmain();`,
    java: `// Generated Java code for: ${prompt}\n\npublic class Main {\n    public static void main(String[] args) {\n        // TODO: Implement logic\n    }\n}`,
    go: `// Generated Go code for: ${prompt}\n\npackage main\n\nfunc main() {\n\t// TODO: Implement logic\n}`,
    html: `<!-- Generated HTML for: ${prompt} -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Page</title>\n</head>\n<body>\n    <!-- TODO: Add content -->\n</body>\n</html>`,
  };

  return templates[language] || templates.javascript;
}
