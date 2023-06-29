import { equal } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { fnv1a } from "./helpers.ts";

// Match result
type Payload = unknown[];
type Context = unknown;
type Operator = string;
type Unit = [boolean, unknown?];
type Operation = [Operator, ...Payload];
type Match = (input: Operation, context: Context) => Unit;
type Matcher = (payload: Payload, context: Context, match: Match) => Unit;

// Default matchers
export const defaultMatchers: Record<Operator, Matcher> = {
  // Equals
  "=": ([value], context) => [equal(context, value)],

  // Greater than
  ">": ([value], context) => [(context as number) > (value as number)],

  // Less than
  "<": ([value], context) => [(context as number) < (value as number)],

  // Regex match
  "~": (
    [value],
    context,
  ) => [new RegExp(value as string, "i").test(context as string)],

  // Match opposite condition
  "!": ([value], context, match) => [!match(value as Operation, context)[0]],

  // Match a property inside the object
  ".": ([key, value], context, match) =>
    match(
      value as Operation,
      (context as Record<string, Context>)[key as string],
    ),

  // Match percentage
  "%": ([namespace, begin, end], context) => {
    // Compute the hash
    const hash = fnv1a(`${(namespace as string)}|${(context as string)}`) /
      2 ** 32;

    // Compute availability based on the percentage and hash
    return [(begin as number) <= hash && hash < (end as number)];
  },

  // Value
  "@": ([value]) => [true, value],

  // Match every condition
  "&": (payload, context, match) => {
    // Keep the value so we can return it
    let matched: Unit = [false];

    // Find the value
    for (const current of (payload as Operation[])) {
      // Look for a value
      matched = match(current, context);

      // Return only
      if (!matched[0]) {
        return [false];
      }
    }

    // Everything was succesful
    return matched;
  },

  // Match any condition
  "|": (payload, context, match) => {
    // Find the value
    for (const current of (payload as Operation[])) {
      // Look for a value
      const matched = match(current, context);

      // Return only
      if (matched[0]) {
        return matched;
      }
    }

    // Nothing was found
    return [false];
  },
};

// Create a custom match
export const create = (
  matchers: Record<Operator, Matcher> = defaultMatchers,
): Match => {
  // Match
  const match = ([type, ...payload]: Operation, context: Context): Unit =>
    matchers[type] ? matchers[type](payload, context, match) : [false];

  // Return match
  return match;
};
