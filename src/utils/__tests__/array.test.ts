import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { count, intersperse, uniq } from '../array.js'

describe('intersperse', () => {
	test('places the separator between items only', () => {
		assert.deepStrictEqual(
			intersperse(['a', 'b', 'c'], () => '|'),
			['a', '|', 'b', '|', 'c'],
		)
	})

	test('passes the index of the following item to the separator', () => {
		assert.deepStrictEqual(
			intersperse([10, 20, 30], (i) => -i),
			[10, -1, 20, -2, 30],
		)
	})

	test('handles empty and single-item input', () => {
		assert.deepStrictEqual(
			intersperse([], () => 'x'),
			[],
		)
		assert.deepStrictEqual(
			intersperse(['only'], () => 'x'),
			['only'],
		)
	})
})

describe('count', () => {
	test('counts items matching a truthy predicate result', () => {
		assert.strictEqual(
			count([1, 2, 3, 4, 5], (n) => n % 2 === 0),
			2,
		)
		assert.strictEqual(
			count(['', 'a', 'b'], (s) => s),
			2,
		)
	})

	test('returns 0 for empty input', () => {
		assert.strictEqual(
			count([], () => true),
			0,
		)
	})
})

describe('uniq', () => {
	test('removes duplicates and keeps first-seen order', () => {
		assert.deepStrictEqual(uniq([3, 1, 3, 2, 1]), [3, 1, 2])
	})

	test('accepts any iterable', () => {
		assert.deepStrictEqual(uniq(new Set([1, 2])), [1, 2])
		assert.deepStrictEqual(uniq('aabbc'), ['a', 'b', 'c'])
	})
})
