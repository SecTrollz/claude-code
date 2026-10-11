import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { CircularBuffer } from '../CircularBuffer.js'

describe('CircularBuffer', () => {
	test('starts empty', () => {
		const buf = new CircularBuffer<number>(3)
		assert.strictEqual(buf.length(), 0)
		assert.deepStrictEqual(buf.toArray(), [])
		assert.deepStrictEqual(buf.getRecent(2), [])
	})

	test('keeps insertion order while under capacity', () => {
		const buf = new CircularBuffer<number>(5)
		buf.addAll([1, 2, 3])
		assert.strictEqual(buf.length(), 3)
		assert.deepStrictEqual(buf.toArray(), [1, 2, 3])
	})

	test('evicts the oldest items once full', () => {
		const buf = new CircularBuffer<number>(3)
		buf.addAll([1, 2, 3, 4, 5])
		assert.strictEqual(buf.length(), 3)
		assert.deepStrictEqual(buf.toArray(), [3, 4, 5])
	})

	test('getRecent returns the newest N, oldest first', () => {
		const buf = new CircularBuffer<number>(4)
		buf.addAll([1, 2, 3, 4, 5, 6])
		assert.deepStrictEqual(buf.getRecent(2), [5, 6])
		assert.deepStrictEqual(buf.getRecent(100), [3, 4, 5, 6])
	})

	test('getRecent works before the buffer wraps', () => {
		const buf = new CircularBuffer<string>(10)
		buf.addAll(['a', 'b', 'c'])
		assert.deepStrictEqual(buf.getRecent(2), ['b', 'c'])
	})

	test('clear resets the buffer and it can be reused', () => {
		const buf = new CircularBuffer<number>(2)
		buf.addAll([1, 2, 3])
		buf.clear()
		assert.strictEqual(buf.length(), 0)
		assert.deepStrictEqual(buf.toArray(), [])
		buf.add(9)
		assert.deepStrictEqual(buf.toArray(), [9])
	})
})
