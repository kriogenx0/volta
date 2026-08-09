import { toMinAndSec, toQaId } from './index'

describe('toMinAndSec', () => {
  it('should format seconds to `mm:ss`', () => {
    expect(toMinAndSec(60)).toBe('01:00')
    expect(toMinAndSec(0)).toBe('00:00')
    expect(toMinAndSec()).toBe('00:00')
  })
})

describe('toQaId', () => {
  it('should create the correct test string based on values provided', () => {
    expect(
      toQaId({
        parentId: 'parent',
        componentId: 'component',
        useId: 'use',
      }),
    ).toBe('parent_component_use')

    expect(
      toQaId({
        parentId: 'parent',
        componentId: 'component',
      }),
    ).toBe('parent_component')

    expect(
      toQaId({
        parentId: 'parent',
        useId: 'use',
      }),
    ).toBe('parent_use')

    expect(
      toQaId({
        componentId: 'component',
        useId: 'use',
      }),
    ).toBe('component_use')

    expect(
      toQaId({
        parentId: 'parent',
      }),
    ).toBe('parent')

    expect(
      toQaId({
        componentId: 'component',
      }),
    ).toBe('component')

    expect(
      toQaId({
        useId: 'use',
      }),
    ).toBe('use')

    expect(toQaId()).toBe('')
  })
})
