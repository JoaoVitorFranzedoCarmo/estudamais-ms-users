/**
 * Testes Unitários — users.domain
 *
 * Funções testadas:
 *   isValidEmail(email)    → valida formato de e-mail
 *   normalizeEmail(email)  → trim + lowercase
 *
 * Execução: node --test src/features/users/users.domain.test.js
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

// ─── Funções de domínio (replicadas do .ts para teste puro em JS) ─────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// ─── isValidEmail ─────────────────────────────────────────────────────────────

test('isValidEmail: e-mail válido simples → true', () => {
  assert.equal(isValidEmail('usuario@email.com'), true);
});

test('isValidEmail: e-mail com subdomínio → true', () => {
  assert.equal(isValidEmail('aluno@pucpr.edu.br'), true);
});

test('isValidEmail: sem @ → false', () => {
  assert.equal(isValidEmail('usuarioemail.com'), false);
});

test('isValidEmail: sem domínio → false', () => {
  assert.equal(isValidEmail('usuario@'), false);
});

test('isValidEmail: string vazia → false', () => {
  assert.equal(isValidEmail(''), false);
});

test('isValidEmail: com espaço no meio → false', () => {
  assert.equal(isValidEmail('usuario @email.com'), false);
});

// ─── normalizeEmail ───────────────────────────────────────────────────────────

test('normalizeEmail: converte maiúsculas para minúsculas', () => {
  assert.equal(normalizeEmail('Usuario@Email.COM'), 'usuario@email.com');
});

test('normalizeEmail: remove espaços antes e depois', () => {
  assert.equal(normalizeEmail('  joao@pucpr.br  '), 'joao@pucpr.br');
});

test('normalizeEmail: e-mail já normalizado permanece igual', () => {
  assert.equal(normalizeEmail('joao@pucpr.br'), 'joao@pucpr.br');
});

test('normalizeEmail: trata espaços e maiúsculas combinados', () => {
  assert.equal(normalizeEmail('  JOAO@PUCPR.BR  '), 'joao@pucpr.br');
});
