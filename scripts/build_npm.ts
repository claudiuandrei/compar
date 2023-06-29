import { build, emptyDir } from "https://deno.land/x/dnt@0.31.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: {
      test: "dev",
    },
  },
  compilerOptions: {
    lib: ["es2021", "dom"],
  },
  package: {
    // package.json properties
    name: "compar",
    version: Deno.args[0],
    description:
      "An easy way to decouple rules from code, and it is ideal for creating custom engines for experiments, feature flags, tutorials, etc.",
    license: "MIT",
    keywords: ["compar", "matcher", "rules", "compare"],
    repository: {
      type: "git",
      url: "git+https://github.com/claudiuandrei/compar.git",
    },
    bugs: {
      url: "https://github.com/claudiuandrei/compar/issues",
    },
    engines: {
      node: ">=11.0.0",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
