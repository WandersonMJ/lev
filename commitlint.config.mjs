/**
 * Commit message rules — see .agents/skills/git-padrao/SKILL.md.
 *
 * @type {import("@commitlint/types").UserConfig}
 */

const FORBIDDEN_PATTERNS = [
  /co-authored-by/i,
  /generated (with|by)/i,
  /\b(claude|anthropic|chatgpt|gpt(-?\d[\w.-]*)?|openai|copilot|gemini|antigravity)\b/i,
];

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "no-ai-mentions": ({ raw }) => {
          const match = FORBIDDEN_PATTERNS.map((pattern) =>
            (raw ?? "").match(pattern),
          ).find(Boolean);
          return [
            !match,
            `commit message must not contain co-authorship trailers or AI tool mentions (found "${match?.[0]}")`,
          ];
        },
      },
    },
  ],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "test",
        "docs",
        "chore",
        "build",
        "ci",
        "perf",
        "style",
      ],
    ],
    "subject-case": [2, "always", "lower-case"],
    "header-max-length": [2, "always", 72],
    "body-empty": [2, "never"],
    "no-ai-mentions": [2, "always"],
  },
};
