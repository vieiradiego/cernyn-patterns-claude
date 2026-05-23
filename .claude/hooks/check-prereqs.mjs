#!/usr/bin/env node
// Verificador cross-platform de pré-requisitos.
// Pode ser chamado por:
//   - /setup-inicial (no fluxo de setup guiado)
//   - manualmente: node .claude/hooks/check-prereqs.mjs

import { spawnSync } from 'node:child_process';

function checkTool(cmd, versionFlag = '--version') {
  const result = spawnSync(cmd, [versionFlag], { encoding: 'utf8', shell: false });
  if (result.status === 0 || result.stdout || result.stderr) {
    const out = (result.stdout + result.stderr).trim().split('\n')[0];
    return { ok: true, version: out };
  }
  return { ok: false, version: null };
}

const tools = {
  // Obrigatórios
  git:    { level: 'obrigatorio', install: 'https://git-scm.com/download' },
  node:   { level: 'obrigatorio', install: 'https://nodejs.org (LTS)' },
  claude: { level: 'obrigatorio', install: 'https://docs.claude.com/claude-code/quickstart' },

  // Fortemente recomendados
  docker: { level: 'recomendado', install: 'https://www.docker.com/products/docker-desktop' },
  code:   { level: 'recomendado', install: 'https://code.visualstudio.com/', note: 'Editor opcional — Claude Code funciona standalone no terminal' },

  // Opcionais
  python: { level: 'opcional', install: 'https://www.python.org/downloads/' },
  aws:    { level: 'opcional', install: 'https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html' },
  dotnet: { level: 'opcional', install: 'https://dotnet.microsoft.com/download' },
  terraform: { level: 'opcional', install: 'https://developer.hashicorp.com/terraform/install' },
};

// Verificar cada um
for (const name of Object.keys(tools)) {
  let res = checkTool(name);
  // Fallback: no Windows, "python" pode ser "py"
  if (!res.ok && name === 'python' && process.platform === 'win32') {
    res = checkTool('py');
  }
  tools[name].status = res.ok ? 'ok' : 'missing';
  tools[name].version = res.version || '';
}

// Relatório legível
const lines = [];
const osName = process.platform === 'win32' ? 'Windows' : process.platform === 'darwin' ? 'macOS' : 'Linux';
lines.push(`🔍 Verificação de pré-requisitos do scaffold Cernyn (${osName})`);
lines.push('');

const printSection = (title, keys, icon) => {
  lines.push(title);
  for (const k of keys) {
    const t = tools[k];
    if (t.status === 'ok') {
      lines.push(`  ✅ ${k} — ${t.version}`);
    } else {
      const noteStr = t.note ? ` (${t.note})` : '';
      lines.push(`  ${icon} ${k} — não instalado${noteStr}. Instale: ${t.install}`);
    }
  }
};

printSection('🔴 Obrigatórios:', ['git', 'node', 'claude'], '❌');
lines.push('');
printSection('🟡 Fortemente recomendados:', ['docker', 'code'], '⚠️');
lines.push('');
printSection('🟢 Opcionais (instale conforme precisar):', ['python', 'aws', 'dotnet', 'terraform'], '➖');
lines.push('');

const missingObrig = Object.values(tools).filter(t => t.level === 'obrigatorio' && t.status !== 'ok').length;
const missingRecom = Object.values(tools).filter(t => t.level === 'recomendado' && t.status !== 'ok').length;

if (missingObrig === 0 && missingRecom === 0) {
  lines.push('🎉 Ambiente completo! Tudo o que você precisa para começar está instalado.');
} else if (missingObrig === 0) {
  lines.push('✅ Pré-requisitos OBRIGATÓRIOS OK. Você pode começar.');
  lines.push(`   ${missingRecom} recomendado(s) ausente(s) — instale conforme a necessidade.`);
} else {
  lines.push(`🚨 INSTALAR ${missingObrig} item(ns) OBRIGATÓRIO(s) antes de continuar.`);
}

lines.push('');
lines.push('Detalhes completos em: docs/pre-requisitos.md');

console.log(lines.join('\n'));
console.log('---JSON---');
console.log(JSON.stringify(tools));

process.exit(0);
