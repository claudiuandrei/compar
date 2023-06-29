# Compar

## Extensible declarative rule matching engine

Compar provides an easy way to decouple rules from code, and it is ideal for
creating custom engines for experiments, feature flags, tutorials, etc. Compar
is written in TypeScript and it runs in the browser, or on the server using
node.js.

### Setup

```bash
yarn add compar
```

or

```bash
npm install --save compar
```

### Usage

Before you start import the library

```javascript
import { create } from "compar";
```

#### Basic usage

```javascript
const match = create();

match(
  [
    "&",
    [".", "environment", ["|", ["=", "stage"], ["=", "production"]]],
    [
      ".",
      "userId",
      [
        "|",
        ["=", "45654800-7a3a-4273-b1cb-4eace4086cce"],
        ["=", "5137c85d-a4d0-4d6c-8d85-0a74a24007c8"],
      ],
    ],
  ],
  {
    environment: "stage",
    userId: "45654800-7a3a-4273-b1cb-4eace4086cce",
  },
);
```

## License

[MIT](LICENSE)
