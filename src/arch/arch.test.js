/**
 * Testes de Arquitetura — estudamais-ms-users
 *
 * Regras verificadas:
 *  1. routes não importa outros routes
 *  2. service não importa routes
 *  3. repository não importa routes nem service
 *  4. domain não importa routes nem service
 *  5. types não importa camadas internas
 *  6. Sem ciclos diretos (A→B→A)
 *
 * Execução: node --test src/arch/arch.test.js
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FEAT = path.join(ROOT, 'features');

function readTs(filePath) {
  try { return fs.readFileSync(filePath, 'utf-8'); } catch { return ''; }
}

function filesMatching(pattern) {
  const allFiles = fs.readdirSync(FEAT, { recursive: true })
    .filter(f => /\.(ts|js)$/.test(f))
    .map(f => path.join(FEAT, f));
  return allFiles.filter(f => path.basename(f).match(pattern));
}

function importsFile(content, keyword) {
  return new RegExp(`from ['"][^'"]*${keyword}[^'"]*['"]`).test(content);
}

function formatViolations(list) {
  return list.map(v => `  ✗ ${v}`).join('\n');
}

// ─── TESTE 1 ─────────────────────────────────────────────────────────────────
test('[MS-Users] routes não importa outros routes', () => {
  const violations = filesMatching(/\.routes\.ts$/)
    .filter(f => {
      const content = readTs(f);
      return filesMatching(/\.routes\.ts$/)
        .filter(other => other !== f)
        .some(other => content.includes(path.basename(other, '.ts')));
    })
    .map(f => path.relative(ROOT, f));
  assert.equal(violations.length, 0,
    `routes importando routes viola separação horizontal\n${formatViolations(violations)}`);
});

// ─── TESTE 2 ─────────────────────────────────────────────────────────────────
test('[MS-Users] service não importa routes', () => {
  const violations = filesMatching(/\.service\.ts$/)
    .filter(f => importsFile(readTs(f), '\\.routes'))
    .map(f => path.relative(ROOT, f));
  assert.equal(violations.length, 0,
    `service importando routes viola Clean Architecture\n${formatViolations(violations)}`);
});

// ─── TESTE 3 ─────────────────────────────────────────────────────────────────
test('[MS-Users] repository não importa routes nem service', () => {
  const violations = filesMatching(/\.repository\.ts$/)
    .filter(f => {
      const c = readTs(f);
      return importsFile(c, '\\.routes') || importsFile(c, '\\.service');
    })
    .map(f => path.relative(ROOT, f));
  assert.equal(violations.length, 0,
    `repository deve ser folha — não importa camadas superiores\n${formatViolations(violations)}`);
});

// ─── TESTE 4 ─────────────────────────────────────────────────────────────────
test('[MS-Users] domain não importa routes nem service', () => {
  const violations = filesMatching(/\.domain\.ts$/)
    .filter(f => {
      const c = readTs(f);
      return importsFile(c, '\\.routes') || importsFile(c, '\\.service');
    })
    .map(f => path.relative(ROOT, f));
  assert.equal(violations.length, 0,
    `domain deve ser puro — sem dependências de camadas superiores\n${formatViolations(violations)}`);
});

// ─── TESTE 5 ─────────────────────────────────────────────────────────────────
test('[MS-Users] types não importa camadas internas', () => {
  const violations = filesMatching(/\.types\.ts$/)
    .filter(f => {
      const c = readTs(f);
      return importsFile(c, '\\.routes') || importsFile(c, '\\.service') || importsFile(c, '\\.repository');
    })
    .map(f => path.relative(ROOT, f));
  assert.equal(violations.length, 0,
    `types deve ser folha sem dependências internas\n${formatViolations(violations)}`);
});

// ─── TESTE 6 ─────────────────────────────────────────────────────────────────
test('[MS-Users] sem ciclos diretos (A → B → A)', () => {
  const allFiles = fs.readdirSync(FEAT, { recursive: true })
    .filter(f => /\.(ts|js)$/.test(f))
    .map(f => path.join(FEAT, f));

  const importMap = new Map();
  for (const file of allFiles) {
    const content = readTs(file);
    const imports = [...content.matchAll(/from ['"](\.[^'"]+)['"]/g)]
      .map(m => path.resolve(path.dirname(file), m[1]));
    importMap.set(file, imports);
  }

  const cycles = [];
  for (const [fileA, importsA] of importMap) {
    for (const fileB of importsA) {
      const importsB = importMap.get(fileB) ?? importMap.get(fileB + '.ts') ?? [];
      if (importsB.some(i => i === fileA || i === fileA.replace(/\.ts$/, ''))) {
        cycles.push(`${path.relative(ROOT, fileA)} ↔ ${path.relative(ROOT, fileB)}`);
      }
    }
  }
  const unique = [...new Set(cycles)];
  assert.equal(unique.length, 0,
    `Ciclos diretos detectados:\n${formatViolations(unique)}`);
});
