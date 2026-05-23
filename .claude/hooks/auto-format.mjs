#!/usr/bin/env node
// Hook: PostToolUse on Edit/Write/MultiEdit (cross-platform)
// Roda o formatador apropriado se disponível. Silencioso se ausente.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { extname, dirname, join } from 'node:path';

let stdin = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (stdin += c));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(stdin);
    const filePath = data?.tool_input?.file_path || data?.tool_input?.path;
    if (!filePath || !existsSync(filePath)) {
      process.exit(0);
    }
    formatFile(filePath);
  } catch {
    // silencioso
  }
  process.exit(0);
});

function which(cmd) {
  const result = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], {
    encoding: 'utf8',
  });
  return result.status === 0 ? result.stdout.trim().split('\n')[0] : null;
}

function run(cmd, args) {
  try {
    spawnSync(cmd, args, { stdio: 'ignore', shell: false });
  } catch {}
}

function findCsprojUp(startDir) {
  let cur = startDir;
  for (let i = 0; i < 5; i++) {
    try {
      const files = readdirSync(cur);
      const found = files.find((f) => f.toLowerCase().endsWith('.csproj'));
      if (found) return join(cur, found);
    } catch {}
    const parent = join(cur, '..');
    if (parent === cur) break;
    cur = parent;
  }
  return null;
}

function formatFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const dir = dirname(filePath);

  const prettierExts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.yml', '.yaml', '.html', '.scss', '.css'];

  if (prettierExts.includes(ext)) {
    const localPrettier =
      process.platform === 'win32'
        ? join('node_modules', '.bin', 'prettier.cmd')
        : join('node_modules', '.bin', 'prettier');
    if (existsSync(localPrettier)) {
      run(localPrettier, ['--write', filePath]);
    } else if (which('prettier')) {
      run('prettier', ['--write', filePath]);
    }
    return;
  }

  if (ext === '.py') {
    if (which('ruff')) {
      run('ruff', ['format', filePath]);
    }
    return;
  }

  if (ext === '.cs') {
    if (!which('dotnet')) return;
    const csproj = findCsprojUp(dir);
    if (csproj) {
      run('dotnet', ['format', csproj, '--include', filePath]);
    }
    return;
  }

  if (ext === '.tf') {
    if (which('terraform')) {
      run('terraform', ['fmt', filePath]);
    }
    return;
  }
}
