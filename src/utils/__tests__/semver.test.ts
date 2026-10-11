import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { gt, gte, lt, lte, order, satisfies } from '../semver.js'

describe('semver comparisons', () => {
	test('gt / lt compare numerically, not lexically', () => {
		assert.strictEqual(gt('1.10.0', '1.9.0'), true)
		assert.strictEqual(lt('1.9.0', '1.10.0'), true)
		assert.strictEqual(gt('1.0.0', '1.0.0'), false)
	})

	test('gte / lte include equality', () => {
		assert.strictEqual(gte('2.0.0', '2.0.0'), true)
		assert.strictEqual(lte('2.0.0', '2.0.0'), true)
		assert.strictEqual(gte('2.0.1', '2.0.0'), true)
		assert.strictEqual(lte('1.9.9', '2.0.0'), true)
	})

	test('order returns -1, 0 or 1', () => {
		assert.strictEqual(order('1.0.0', '2.0.0'), -1)
		assert.strictEqual(order('2.0.0', '2.0.0'), 0)
		assert.strictEqual(order('2.0.1', '2.0.0'), 1)
	})

	test('pre-releases sort before the release', () => {
		assert.strictEqual(lt('1.0.0-beta.1', '1.0.0'), true)
	})

	test('satisfies honours ranges', () => {
		assert.strictEqual(satisfies('1.2.3', '>=1.0.0 <2.0.0'), true)
		assert.strictEqual(satisfies('2.0.0', '>=1.0.0 <2.0.0'), false)
	})
})
