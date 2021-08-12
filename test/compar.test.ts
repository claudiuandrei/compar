import { create } from '../src/compar'

// Load the default match
const match = create()

describe('EQUAL', () => {
  // Test equality
  test('EQUAL should match an exact value', () => {
    // Setup the match
    const [ct] = match('John Doe', ['=', 'John Doe'])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('EQUAL should not match an other value', () => {
    // Setup the match
    const [ct] = match('John Doe', ['=', 'Jane Doe'])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('GREATER_THAN', () => {
  // Test equality
  test('GREATER_THAN should match a greater value', () => {
    // Setup the match
    const [ct] = match(25, ['>', 20])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('GREATER_THAN should not match a lesser value', () => {
    // Setup the match
    const [ct] = match(25, ['>', 40])

    // Match result should be true
    expect(ct).toEqual(false)
  })

  // Test equality
  test('GREATER_THAN should not match an equal value', () => {
    // Setup the match
    const [ct] = match(25, ['>', 25])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('LESS_THAN', () => {
  // Test equality
  test('LESS_THAN should match a lesser value', () => {
    // Setup the match
    const [ct] = match(25, ['<', 40])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('LESS_THAN should not match a greater value', () => {
    // Setup the match
    const [ct] = match(25, ['<', 20])

    // Match result should be true
    expect(ct).toEqual(false)
  })

  // Test equality
  test('LESS_THAN should not match an equal value', () => {
    // Setup the match
    const [ct] = match(25, ['<', 25])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('REGEXP', () => {
  // Test equality
  test('REGEXP should match a regex value', () => {
    // Setup the match
    const [ct] = match('John Doe', ['~', '(.*) Doe'])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('REGEXP should match a non matching regex value', () => {
    // Setup the match
    const [ct] = match('John Doe', ['~', '[0-9]+'])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('NOT', () => {
  // Test equality
  test('NOT should match an the oposite value', () => {
    // Setup the match
    const [ct] = match('John Doe', ['!', ['=', 'Jane Doe']])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('NOT should not match an the value', () => {
    // Setup the match
    const [ct] = match('John Doe', ['!', ['=', 'John Doe']])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('MATCH', () => {
  // Test equality
  test('MATCH should match nested properties', () => {
    // Setup the match
    const [ct] = match(
      {
        uid: '01234567-abcd-4abc-8def-0123456789ab',
      },
      ['.', 'uid', ['=', '01234567-abcd-4abc-8def-0123456789ab']]
    )

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('MATCH should not match nested properties when condition is false', () => {
    // Setup the match
    const [ct] = match(
      {
        uid: '01234567-abcd-4abc-8def-0123456789ab',
      },
      ['.', 'aid', ['=', '01234567-abcd-4abc-8def-0123456789ab']]
    )

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('PERCENT', () => {
  // Test equality
  test('PERCENT should match 100%', () => {
    // Setup the match
    const [ct] = match('John Doe', ['%', 'namespace', 0, 100])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('PERCENT should not match 0%', () => {
    // Setup the match
    const [ct] = match('John Doe', ['%', 'namespace', 0, 0])

    // Match result should be true
    expect(ct).toEqual(false)
  })

  // Test equality
  // This is number will be different for different tests, it is made for this specific test
  test('PERCENT should match if in bucket', () => {
    // Setup the match
    const [ct] = match('John Doe', ['%', 'namespace', 0, 80])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  // This is number will be different for different tests, it is made for this specific test
  test('PERCENT should not match if not in bucket', () => {
    // Setup the match
    const [ct] = match('John Doe', ['%', 'namespace', 0, 70])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('VALUE', () => {
  // Test equality
  test('VALUE should retrieve the value, no condition', () => {
    // Setup the match
    const [ct, v] = match('John Doe', ['@', 'Jane Doe'])

    // Match result should be true
    expect(ct).toEqual(true)
    expect(v).toEqual('Jane Doe')
  })
})

describe('CONDITIONAL', () => {
  // Test equality
  test('CONDITIONAL should retrieve value if condition matches', () => {
    // Setup the match
    const [ct, v] = match('John Doe', ['&', ['=', 'John Doe'], ['@', 'Jane Doe']])

    // Match result should be true
    expect(ct).toEqual(true)
    expect(v).toEqual('Jane Doe')
  })

  // Test equality
  test('CONDITIONAL should not retrieve value if condition does not match', () => {
    // Setup the match
    const [ct, v] = match('John Doe', ['&', ['=', 'Jane Doe'], ['@', 'Jane Doe']])

    // Match result should be true
    expect(ct).toEqual(false)
    expect(v).toBeUndefined()
  })
})

describe('EVERY', () => {
  // Test equality
  test('EVERY should match if all values match', () => {
    // Setup the match
    const [ct] = match(25, ['&', ['>', 20], ['<', 40]])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('EVERY should not match if any values match', () => {
    // Setup the match
    const [ct] = match(25, ['&', ['>', 20], ['<', 20]])

    // Match result should be true
    expect(ct).toEqual(false)
  })

  // Test equality
  test('EVERY should not match if none of the values match', () => {
    // Setup the match
    const [ct] = match(25, ['&', ['>', 40], ['<', 20]])

    // Match result should be true
    expect(ct).toEqual(false)
  })

  // Test equality
  test('EVERY should not retrieve value if not all conditions match', () => {
    // Setup the match
    const [ct, v] = match('John Doe', ['&', ['=', 'Jane Doe'], ['=', 'John Doe'], ['@', 'No one']])

    // Match result should be true
    expect(ct).toEqual(false)
    expect(v).toBeUndefined()
  })

  // Test equality
  test('EVERY should retrieve last value if all conditions match and there is a default', () => {
    // Setup the match
    const [ct, v] = match('Jane Doe', ['&', ['=', 'Jane Doe'], ['@', 'Everyone']])

    // Match result should be true
    expect(ct).toEqual(true)
    expect(v).toEqual('Everyone')
  })
})

describe('SOME', () => {
  // Test equality
  test('SOME should match if all values match', () => {
    // Setup the match
    const [ct] = match(25, ['|', ['>', 20], ['<', 40]])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('SOME should match if any values match', () => {
    // Setup the match
    const [ct] = match(25, ['|', ['>', 40], ['<', 30]])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('SOME should not match if none of the values match', () => {
    // Setup the match
    const [ct] = match(25, ['|', ['>', 40], ['<', 20]])

    // Match result should be true
    expect(ct).toEqual(false)
  })

  // Test equality
  test('SOME should retrieve the first when condition matches', () => {
    // Setup the match
    const [ct, v] = match('John Doe', [
      '|',
      ['&', ['=', 'Jane Doe'], ['@', 'Jane Doe']],
      ['&', ['=', 'John Doe'], ['@', 'John Doe']],
      ['@', 'No one'],
    ])

    // Match result should be true
    expect(ct).toEqual(true)
    expect(v).toEqual('John Doe')
  })

  // Test equality
  test('SOME should retrieve default value if no condition matches and there is a default', () => {
    // Setup the match
    const [ct, v] = match('John Doe', [
      '|',
      ['&', ['=', 'Jane Doe'], ['@', 'Jane Doe']],
      ['@', 'No one'],
    ])

    // Match result should be true
    expect(ct).toEqual(true)
    expect(v).toEqual('No one')
  })

  // Test equality
  test('SOME should not retrieve any value if no condition matches', () => {
    // Setup the match
    const [ct, v] = match('John Doe', ['|', ['&', ['=', 'Jane Doe'], ['@', 'Jane Doe']]])

    // Match result should be true
    expect(ct).toEqual(false)
    expect(v).toBeUndefined()
  })
})

describe('DEFAULT', () => {
  // Test equality
  test('Not supported types should not match', () => {
    // Setup the match
    const [ct] = match('John Doe', ['NOT_SUPPORTED', 'John Doe'])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})

describe('CUSTOM_MATCH', () => {
  // Test equality
  test('Custom matcher should match the conditions', () => {
    // Setup the match
    const customMatch = create({ EQUAL: (match, context, [value]) => [context === value] })

    // Create custom matcher
    const [ct] = customMatch('John Doe', ['EQUAL', 'John Doe'])

    // Match result should be true
    expect(ct).toEqual(true)
  })

  // Test equality
  test('Custom matcher should not match default conditions', () => {
    // Setup the match
    const customMatch = create({ EQUAL: (context, [value]) => [context === value] })

    // Create custom matcher
    const [ct] = customMatch('John Doe', ['=', 'John Doe'])

    // Match result should be true
    expect(ct).toEqual(false)
  })
})
