#!/usr/bin/env node
// Hook: PreToolUse on Bash (cross-platform)
// Antes de um `git push`, escaneia o diff por padrões de segredos.
// BLOQUEIA o push se encontrar segredo — esta é a ÚNICA regra dura do scaffold
// (vazar credencial é irreversível). Todo o resto é direcionamento, não bloqueio.

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
    const findings = scanForSecrets();
    if (findings.length > 0) {
      blockPush(findings);
      return;
    }
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
  if (!diff) return [];

  const findings = [];
  for (const p of patterns) {
    const matches = diff.match(p.re);
    if (matches && matches.length > 0) {
      findings.push(`  • ${p.name} (${matches.length} ocorrência(s))`);
    }
  }
  return findings;
}

function blockPush(findings) {
  const reason = `🔒 PUSH BLOQUEADO — possível segredo no diff.

Padrões que parecem credenciais nas mudanças a enviar:
${findings.join('\n')}

Esta é a única regra de bloqueio do scaffold (vazar segredo é irreversível). Para resolver:
  1. Remova o segredo do código (use variável de ambiente / .env, que está no .gitignore).
  2. Se já foi commitado, ROTACIONE a credencial e limpe o histórico (peça ajuda ao revisor-seguranca).
  3. Se for falso positivo (dado de teste), o humano pode dar o push manualmente no terminal,
     ou desabilitar este hook em .claude/settings.json.`;

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}
