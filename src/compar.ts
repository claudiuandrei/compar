import equals from 'fast-deep-equal'
import { fnv1a, range } from './utils'

// Match result
type Unit = [boolean, any?]

// Matcher
type Matcher = (
  match: (context: any, input: any) => Unit,
  context: any,
  payload: Array<any>
) => Unit

// Default matchers
export const defaultMatchers: { [type: string]: Matcher } = {
  // Equals
  '=': (match, context, [value]) => [equals(context, value)],

  // Greater than
  '>': (match, context, [value]) => [context > value],

  // Less than
  '<': (match, context, [value]) => [context < value],

  // Regex match
  '~': (match, context, [value]) => [new RegExp(value, 'i').test(context)],

  // Match every condition
  '&': (match, context, payload) => [payload.every(value => match(context, value)[0])],

  // Match any condition
  '|': (match, context, payload) => [payload.some(value => match(context, value)[0])],

  // Match opposite condition
  '!': (match, context, [value]) => [!match(context, value)[0]],

  // Match a property inside the object
  '.': (match, context, [key, value]) => match(context[key], value),

  // Match percentage
  '%': (match, context, [namespace, begin, end]) => {
    // Compute the hash
    const hash = range(0, 99)(fnv1a(`${namespace}|${context}`) / 2 ** 32)

    // Compute availability based on the percentage and hash
    return [begin <= hash && hash < end]
  },

  // Value
  '@': (match, context, [value]) => [true, value],

  // Conditional
  '?': (match, context, [condition, value]) =>
    match(context, condition)[0] ? match(context, value) : [false],

  // Find
  '*': (match, context, payload) => {
    // Find the value
    for (let index = 0; index < payload.length; index += 1) {
      // Look for a value
      const [success, value] = match(context, payload[index])

      // Return only
      if (success) {
        return [true, value]
      }
    }

    // Nothing was found
    return [false]
  }
}

// Create a custom match
export const create = (matchers: { [type: string]: Matcher } = defaultMatchers) => {
  // Match
  const match = (context: any, [type, ...payload]: [string, ...Array<any>]): Unit =>
    matchers[type] ? matchers[type](match, context, payload) : [false]

  // Return match
  return match
}
