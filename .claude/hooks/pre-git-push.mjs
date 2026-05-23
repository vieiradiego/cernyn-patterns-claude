#!/usr/bin/env node
// Hook: PreToolUse on Bash (cross-platform)
// Antes de um `git push`, escaneia o diff por padrões de segredos.
// Alerta no stderr — não bloqueia.

import { spawnSync } from 'node:child_process';

let stdin = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (stdin += c));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(stdin);
    const command = data?.tool_input?.command || '';
    if (!/\bgit\s+push\b/.test(command)) {
      process.exit(0);
    }
    scanForSecrets();
  } catch {}
  process.exit(0);
});

function scanForSecrets() {
  const patterns = [
    { name: 'AWS Access Key', re: /AKIA[0-9A-Z]{16}/g },
    { name: 'AWS Secret reference', re: /aws_secret_access_key/gi },
    { name: 'Chave privada PEM', re: /BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY/g },
    { name: 'JWT token', re: /eyJ[A-Za-z0-9_-]{20,}\.eyJ/g },
    { name: 'OpenAI/Anthropic-style API key', re: /sk-[a-zA-Z0-9]{20,}/g },
    { name: 'GitHub PAT', re: /ghp_[a-zA-Z0-9]{20,}/g },
    { name: 'Slack token', re: /xox[abprs]-[A-Za-z0-9-]{10,}/g },
  ];

  let diff = spawnSync('git', ['diff', '@{u}..HEAD'], { encoding: 'utf8' }).stdout;
  if (!diff) {
    diff = spawnSync('git', ['diff', '--cached'], { encoding: 'utf8' }).stdout;
  }
  if (!diff) return;

  const findings = [];
  for (const p of patterns) {
    const matches = diff.match(p.re);
    if (matches && matches.length > 0) {
      findings.push(`  ⚠️  ${p.name} (${matches.length} ocorrência(s))`);
    }
  }

  if (findings.length > 0) {
    const warning = `
🔒 [revisor-seguranca / hook] AVISO antes do git push:

Encontrei padrões que parecem segredos nas mudanças que você está prestes a enviar:

${findings.join('\n')}

Não estou bloqueando, mas confirme que:
  1. Estes são exemplos falsos / dados de teste
  2. OU rotacione o segredo antes de continuar
  3. Considere rodar o subagent 'revisor-seguranca' antes de pushar

Para abortar o push: Ctrl+C agora.
`;
    process.stderr.write(warning);
  }
}
