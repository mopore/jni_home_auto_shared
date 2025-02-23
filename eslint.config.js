import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/node_modules", 
        "**/dist", 
        "**/coverage", 
        "**/test-core", 
        "**/test-integration", 
        "**/.eslintrc.cjs"
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint
    },

    languageOptions: {
        parserOptions: {
            projectService: {
                allowDefaultProject: ['*.js'],
            },
        },
    },

    rules: {
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/array-type": "warn",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/prefer-as-const": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/no-wrapper-object-types": "warn",
        "@typescript-eslint/no-empty-object-type": "warn",
        "@typescript-eslint/no-unsafe-function-type": "warn",
        "@typescript-eslint/no-use-before-define": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/strict-boolean-expressions": ["error", {
            allowNumber: false,
            allowNullableObject: true,
            allowNullableBoolean: false,
            allowNullableString: true,
            allowNullableNumber: false,
            allowAny: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
        }],
        "@typescript-eslint/no-unnecessary-condition": "error"
    },
}];