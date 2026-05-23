#!/usr/bin/env node
// Hook: SessionStart (cross-platform: Windows, Mac, Linux)
// Detecta primeira execução e relata estado do projeto.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const cwd = process.cwd();
const messages = [];

// Primeira execução? sinais: sem .git E .LEARNINGS vazia E exemplos/ vazia
const hasGit = existsSync(resolve(cwd, '.git'));
let learningCount = 0;
const memoryPath = resolve(cwd, '.LEARNINGS', 'MEMORY.md');
if (existsSync(memoryPath)) {
  const content = readFileSync(memoryPath, 'utf8');
  // Ignora exemplos dentro de comentários HTML (template usa "- [Título curto](...)" como exemplo)
  const stripped = content.replace(/<!--[\s\S]*?-->/g, '');
  learningCount = (stripped.match(/^- \[/gm) || []).length;
}
let hasExperiments = false;
const exemplosPath = resolve(cwd, 'exemplos');
if (existsSync(exemplosPath)) {
  try {
    hasExperiments = readdirSync(exemplosPath, { withFileTypes: true })
      .filter(d => d.isDirectory()).length > 0;
  } catch {}
}

const isFirstRun = !hasGit && learningCount === 0 && !hasExperiments;

if (isFirstRun) {
  messages.push('🎯 PRIMEIRO USO detectado neste scaffold.');
  messages.push('Sugira ao usuário rodar /setup-inicial para configurar o ambiente (verifica pré-requisitos, personaliza CLAUDE.md, inicializa Git).');
  messages.push('Não force — apenas ofereça uma vez no início da conversa.');
} else {
  if (learningCount > 0) {
    messages.push(`📒 Este projeto tem ${learningCount} aprendizado(s) registrado(s) em .LEARNINGS/MEMORY.md — consulte antes de propor soluções.`);
  } else {
    messages.push('📒 .LEARNINGS/ está vazio. Lembre-se de capturar decisões importantes com /aprender.');
  }
}

if (existsSync(resolve(cwd, 'docker', 'docker-compose.example.yml'))) {
  messages.push('🐳 Docker Compose disponível em docker/docker-compose.example.yml para simular serviços AWS local (precisa Docker Desktop instalado).');
}

if (existsSync(resolve(cwd, 'HANDOFF.md'))) {
  messages.push('🤝 HANDOFF.md presente — este experimento está em processo de entrega ao time de dev.');
}

// Info sobre OS — útil para o Claude saber qual shell/path usar
const platform = process.platform === 'win32' ? 'Windows' : process.platform === 'darwin' ? 'macOS' : 'Linux';
messages.push(`💻 Sistema operacional detectado: ${platform}.`);

if (messages.length > 0) {
  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: messages.join('\n'),
    },
  };
  process.stdout.write(JSON.stringify(output));
}

process.exit(0);
