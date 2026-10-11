import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { djb2Hash, hashContent, hashPair } from '../hash.js'

describe('djb2Hash', () => {
	test('is deterministic and matches known values', () => {
		assert.strictEqual(djb2Hash(''), 0)
		assert.strictEqual(djb2Hash('a'), 97)
		assert.strictEqual(djb2Hash('hello'), djb2Hash('hello'))
		assert.notStrictEqual(djb2Hash('hello'), djb2Hash('hellp'))
	})

	test('always returns a signed 32-bit integer', () => {
		const h = djb2Hash('x'.repeat(10_000))
		assert.strictEqual(Number.isInteger(h), true)
		assert.ok(h >= -(2 ** 31))
		assert.ok(h < 2 ** 31)
	})
})

describe('hashContent', () => {
	test('is stable for equal input and differs for different input', () => {
		assert.strictEqual(hashContent('abc'), hashContent('abc'))
		assert.notStrictEqual(hashContent('abc'), hashContent('abd'))
	})
})

describe('hashPair', () => {
	test('is stable and order-sensitive', () => {
		assert.strictEqual(hashPair('a', 'b'), hashPair('a', 'b'))
		assert.notStrictEqual(hashPair('a', 'b'), hashPair('b', 'a'))
	})

	test('does not collide on shifted boundaries', () => {
		assert.notStrictEqual(hashPair('ts', 'code'), hashPair('tsc', 'ode'))
	})
})
