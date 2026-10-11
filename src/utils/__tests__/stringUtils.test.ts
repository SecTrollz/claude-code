import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
	EndTruncatingAccumulator,
	capitalize,
	countCharInString,
	escapeRegExp,
	firstLineOf,
	normalizeFullWidthDigits,
	normalizeFullWidthSpace,
	plural,
	safeJoinLines,
	truncateToLines,
} from '../stringUtils.js'

describe('escapeRegExp', () => {
	test('escapes every regex metacharacter so the result matches literally', () => {
		const raw = 'a.b*c+d?e^f${g}(h)|i[j]\\k'
		assert.strictEqual(new RegExp(escapeRegExp(raw)).test(raw), true)
		assert.strictEqual(new RegExp(escapeRegExp('a.c')).test('abc'), false)
	})
})

describe('capitalize', () => {
	test('uppercases only the first character', () => {
		assert.strictEqual(capitalize('fooBar'), 'FooBar')
		assert.strictEqual(capitalize('hello world'), 'Hello world')
		assert.strictEqual(capitalize(''), '')
	})
})

describe('plural', () => {
	test('uses the singular only for exactly 1', () => {
		assert.strictEqual(plural(1, 'file'), 'file')
		assert.strictEqual(plural(0, 'file'), 'files')
		assert.strictEqual(plural(3, 'file'), 'files')
	})

	test('supports an explicit plural form', () => {
		assert.strictEqual(plural(2, 'entry', 'entries'), 'entries')
	})
})

describe('firstLineOf / countCharInString', () => {
	test('firstLineOf returns text up to the first newline', () => {
		assert.strictEqual(firstLineOf('#!/bin/sh\necho hi'), '#!/bin/sh')
		assert.strictEqual(firstLineOf('single'), 'single')
	})

	test('countCharInString counts occurrences from a start offset', () => {
		assert.strictEqual(countCharInString('a\nb\nc', '\n'), 2)
		assert.strictEqual(countCharInString('a\nb\nc', '\n', 2), 1)
		assert.strictEqual(countCharInString('abc', 'z'), 0)
	})
})

describe('full-width normalization', () => {
	test('converts full-width digits and spaces', () => {
		assert.strictEqual(normalizeFullWidthDigits('１２３abc'), '123abc')
		assert.strictEqual(normalizeFullWidthSpace('a　b'), 'a b')
	})
})

describe('safeJoinLines', () => {
	test('joins normally when under the limit', () => {
		assert.strictEqual(safeJoinLines(['a', 'b', 'c'], ','), 'a,b,c')
	})

	test('truncates a partially fitting line to exactly maxSize, marker included', () => {
		const out = safeJoinLines(['x'.repeat(50)], ',', 30)
		assert.strictEqual(out, `${'x'.repeat(16)}...[truncated]`)
		assert.strictEqual(out.length, 30)
	})

	test('appends only the marker when no room is left for the next line', () => {
		const out = safeJoinLines(['x'.repeat(50), 'y'.repeat(50)], ',', 60)
		assert.strictEqual(out, `${'x'.repeat(50)}...[truncated]`)
	})
})

describe('truncateToLines', () => {
	test('leaves short text alone and truncates long text with an ellipsis', () => {
		assert.strictEqual(truncateToLines('a\nb', 5), 'a\nb')
		assert.strictEqual(truncateToLines('a\nb\nc\nd', 2), 'a\nb…')
	})
})

describe('EndTruncatingAccumulator', () => {
	test('keeps the beginning when output exceeds the limit', () => {
		const acc = new EndTruncatingAccumulator(10)
		acc.append('0123456789')
		acc.append('ABCDEF')
		const out = acc.toString()
		assert.strictEqual(out.startsWith('0123456789'), true)
		assert.ok(out.includes('truncated'))
	})
})
