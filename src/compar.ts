import equals from 'fast-deep-equal'
import { fnv1a, range } from './utils'

// Match fn
type MatchFn = (context: any, [type, ...payload]: [string, ...Array<any>]) => boolean
type Matcher = (context: any, payload: Array<any>, match: MatchFn, types: Array<string>) => boolean

// Default matchers
export const defaultMatchers: { [type: string]: Matcher } = {
  // Equals
  '=': (context, [value]) => equals(context, value),

  // Greater than
  '>': (context, [value]) => context > value,

  // Less than
  '<': (context, [value]) => context < value,

  // Regex match
  '~': (context, [value]) => new RegExp(value, 'i').test(context),

  // Match every condition
  '&': (context, payload, match) => payload.every(value => match(context, value)),

  // Match any condition
  '|': (context, payload, match) => payload.some(value => match(context, value)),

  // Match opposite condition
  '!': (context, [value], match) => !match(context, value),

  // Match a property inside the object
  '.': (context, [key, value], match) => match(context[key], value),

  // Match percentage
  '%': (context, [namespace, begin, end], match) => {
    // Compute the hash
    const hash = range(0, 99)(fnv1a(`${namespace}|${context}`) / 2 ** 32)

    // Compute availability based on the percentage and hash
    return begin <= hash && hash < end
  }
}

// Create a custom match
export const createMatch = (matchers: { [type: string]: Matcher } = defaultMatchers) => {
  // Types
  const types = Object.keys(matchers)

  // Match
  const match = (context: any, [type, ...payload]: [string, ...Array<any>]): boolean =>
    matchers[type] ? matchers[type](context, payload, match, types) : false

  // Return match
  return match
}

// Create the default matchers
export const match = createMatch()
