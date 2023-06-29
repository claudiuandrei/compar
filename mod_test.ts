import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { create } from "./mod.ts";

// Load the default match
const match = create();

Deno.test("'=' (EQUAL) operator", async (t) => {
  await t.step("'=' operator should match an exact value", () => {
    // Setup the match
    const [ct] = match(["=", "John Doe"], "John Doe");

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'=' operator should not match an other value",
    () => {
      // Setup the match
      const [ct] = match(["=", "Jane Doe"], "John Doe");

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'>' (GREATER_THAN) operator", async (t) => {
  await t.step("'>' should match a greater value", () => {
    // Setup the match
    const [ct] = match([">", 20], 25);

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'>' should not match a lesser value",
    () => {
      // Setup the match
      const [ct] = match([">", 40], 25);

      // Match result should be false
      assertEquals(ct, false);
    },
  );
  await t.step(
    "'>' should not match an equal value",
    () => {
      // Setup the match
      const [ct] = match([">", 25], 25);

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'<' (LESS_THAN) operator", async (t) => {
  await t.step("'<' should match a lesser value", () => {
    // Setup the match
    const [ct] = match(["<", 40], 25);

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'<' should not match a greater value",
    () => {
      // Setup the match
      const [ct] = match(["<", 20], 25);

      // Match result should be false
      assertEquals(ct, false);
    },
  );
  await t.step(
    "'<' should not match an equal value",
    () => {
      // Setup the match
      const [ct] = match(["<", 25], 25);

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'~' (REGEX) operator", async (t) => {
  await t.step("'~' should match a regex value", () => {
    // Setup the match
    const [ct] = match(["~", "(.*) Doe"], "John Doe");

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'~' should match a non matching regex value",
    () => {
      // Setup the match
      const [ct] = match(["~", "[0-9]+"], "John Doe");

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'!' (NOT) operator", async (t) => {
  await t.step("'!' should negate a positive match", () => {
    // Setup the match
    const [ct] = match(["!", ["=", "Jane Doe"]], "John Doe");

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'!' should negate a negative match",
    () => {
      // Setup the match
      const [ct] = match(["!", ["=", "John Doe"]], "John Doe");

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'.' (KEY_ACCESSOR) operator", async (t) => {
  await t.step("'.' should match nested properties", () => {
    // Setup the match
    const [ct] = match([".", "uid", [
      "=",
      "01234567-abcd-4abc-8def-0123456789ab",
    ]], {
      uid: "01234567-abcd-4abc-8def-0123456789ab",
    });

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'.' should not match nested properties when condition is false",
    () => {
      // Setup the match
      const [ct] = match([".", "aid", [
        "=",
        "01234567-abcd-4abc-8def-0123456789ab",
      ]], {
        uid: "01234567-abcd-4abc-8def-0123456789ab",
      });

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'%' (PERCENT) operator", async (t) => {
  await t.step("'%' should match 100%", () => {
    // Setup the match
    const [ct] = match(["%", "namespace", 0, 1], "John Doe");

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step(
    "'%' should match 100%",
    () => {
      // Setup the match
      const [ct] = match(["%", "namespace", 0, 0], "John Doe");

      // Match result should be false
      assertEquals(ct, false);
    },
  );
  await t.step(
    "'%' should match should match if in bucket",
    () => {
      // Setup the match
      const [ct] = match(["%", "namespace", 0, 0.8], "John Doe");

      // Match result should be false
      assertEquals(ct, true);
    },
  );
  await t.step(
    "'%' should match should not match if not in bucket",
    () => {
      // Setup the match
      const [ct] = match(["%", "namespace", 0, 0.7], "John Doe");

      // Match result should be false
      assertEquals(ct, false);
    },
  );
});

Deno.test("'@' (REFERENCE) operator", async (t) => {
  await t.step("'@' should retrieve the value, no condition", () => {
    // Setup the match
    const [ct, v] = match(["@", "Jane Doe"], "John Doe");

    // Match result should be true
    assertEquals(ct, true);
    assertEquals(v, "Jane Doe");
  });
});

Deno.test("'&' (EVERY) operator", async (t) => {
  await t.step("'&' should match if all values match", () => {
    // Setup the match
    const [ct] = match(["&", [">", 20], ["<", 40]], 25);

    // Match result should be true
    assertEquals(ct, true);
  });
  await t.step("'&' should not match if any values don't match", () => {
    // Setup the match
    const [ct] = match(["&", [">", 20], ["<", 20]], 25);

    // Match result should be true
    assertEquals(ct, false);
  });
  await t.step("'&' should not match if none of the values match", () => {
    // Setup the match
    const [ct] = match(["&", [">", 40], ["<", 20]], 25);

    // Match result should be true
    assertEquals(ct, false);
  });
  await t.step(
    "'&' should not retrieve value if not all conditions match",
    () => {
      // Setup the match
      const [ct, v] = match(["&", ["=", "Jane Doe"], ["=", "John Doe"], [
        "@",
        "No one",
      ]], "John Doe");

      // Match result should be true
      assertEquals(ct, false);
      assertEquals(v, undefined);
    },
  );
  await t.step(
    "'&' should retrieve last value if all conditions match and there is a default",
    () => {
      // Setup the match
      const [ct, v] = match(
        ["&", ["=", "Jane Doe"], ["@", "Everyone"]],
        "Jane Doe",
      );

      // Match result should be true
      assertEquals(ct, true);
      assertEquals(v, "Everyone");
    },
  );
});

Deno.test("'|' (SOME) operator", async (t) => {
  await t.step("'|' should match if all values match", () => {
    const [ct] = match(["|", [">", 20], ["<", 40]], 25);

    // Match result should be true
    assertEquals(ct, true);
  });

  await t.step("'|' should match if any values match", () => {
    const [ct] = match(["|", [">", 20], ["<", 20]], 25);

    // Match result should be true
    assertEquals(ct, true);
  });

  await t.step("'|' should not match if none of the values match", () => {
    const [ct] = match(["|", [">", 40], ["<", 20]], 25);

    // Match result should be false
    assertEquals(ct, false);
  });

  await t.step(
    "'|' should not retrieve any value if no condition matches",
    () => {
      const [ct, v] = match(
        ["|", ["=", "Jane Doe"], ["=", "Mark Doe"]],
        "John Doe",
      );

      // Match result should be false and value should be undefined
      assertEquals(ct, false);
      assertEquals(v, undefined);
    },
  );

  await t.step("'|' should retrieve the first when condition matches", () => {
    const [ct, v] = match([
      "|",
      ["&", ["=", "Jane Doe"], ["@", "Jane Doe"]],
      ["&", ["=", "John Doe"], ["@", "John Doe"]],
      ["@", "No one"],
    ], "John Doe");

    // Match result should be true and value should be "John Doe"
    assertEquals(ct, true);
    assertEquals(v, "John Doe");
  });

  await t.step(
    "'|' should retrieve default value if no condition matches and there is a default",
    () => {
      const [ct, v] = match([
        "|",
        ["&", ["=", "Jane Doe"], ["@", "Jane Doe"]],
        ["@", "No one"],
      ], "John Doe");

      // Match result should be true and the value should be the default "No one"
      assertEquals(ct, true);
      assertEquals(v, "No one");
    },
  );
});

Deno.test("Not supported operator", async (t) => {
  await t.step("Not supported / undefined types should not match", () => {
    const [ct] = match(["?", "John Doe"], "John Doe");

    // Match result should be false
    assertEquals(ct, false);
  });
});

Deno.test("Custom matchers", async (t) => {
  // Create custom matcher
  const customMatch = create({
    EQUAL: ([value], context) => [context === value],
  });

  await t.step("Custom matcher should match the custom conditions", () => {
    const [ct] = customMatch(["EQUAL", "John Doe"], "John Doe");

    // Match result should be true
    assertEquals(ct, true);
  });

  await t.step("Custom matcher should not match default conditions", () => {
    const [ct] = customMatch(["=", "John Doe"], "John Doe");

    // Match result should be false
    assertEquals(ct, false);
  });
});
