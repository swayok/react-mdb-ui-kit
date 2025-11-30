import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

const rules = {
    // Arrays formatting.
    '@stylistic/array-bracket-newline': [
        'error',
        'consistent',
    ],
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/array-element-newline': [
        'error',
        {
            'ArrayExpression': {
                consistent: true,
                multiline: true,
            },
            'ArrayPattern': 'always',
        }
    ],
    // Arrow functions formatting.
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/no-confusing-arrow': 'error',
    'arrow-body-style': ['error', 'as-needed'],

    // Code blocks formatting.
    '@stylistic/block-spacing': ['error', 'always'],
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/curly-newline': ['error', 'always'],

    // Comas formatting.
    '@stylistic/comma-dangle': [
        'error',
        {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'never',
            importAttributes: 'always-multiline',
            dynamicImports: 'never',
            enums: 'always-multiline',
            generics: 'always-multiline',
            tuples: 'always-multiline',
        }
    ],
    '@stylistic/comma-spacing': 'error',
    '@stylistic/comma-style': ['error', 'last'],

    // obj[foo] / const { [a]: someProp } = obj;
    '@stylistic/computed-property-spacing': ['error', 'never'],

    // Dot formatting in multiline object.property calls.
    '@stylistic/dot-location': ['error', 'property'],

    // EOF at the ond of file.
    '@stylistic/eol-last': ['error', 'always'],

    // Functions formatting.
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/function-paren-newline': ['error', 'consistent'],

    // Indentation.
    '@stylistic/indent': [
        'error',
        4,
        {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            CallExpression: {
                arguments: 1
            },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            offsetTernaryExpressions: false,
            ignoreComments: false,
        }
    ],
    '@stylistic/indent-binary-ops': ['error', 4],

    // Objects formatting.
    '@stylistic/key-spacing': [
        'error',
        {
            beforeColon: false,
            afterColon: true,
            mode: 'strict',
        }
    ],

    // Which Line breaks to use.
    '@stylistic/linebreak-style': ['error', 'unix'],

    // Class members formatting.
    '@stylistic/lines-between-class-members': [
        'error',
        {
            enforce: [
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'method',
                },
                {
                    blankLine: 'always',
                    prev: 'method',
                    next: 'field',
                },
            ]
        }
    ],

    // Maximum line length.
    '@stylistic/max-len': [
        'error',
        {
            code: 120,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true,
        }
    ],

    // Forbid several statements in a single line.
    '@stylistic/max-statements-per-line': [
        'error',
        {
            max: 1,
        }
    ],

    // Members formatting in types and interfaces.
    '@stylistic/member-delimiter-style': [
        'error',
        {
            'multiline': {
                'delimiter': 'none',
                'requireLast': false
            },
            'singleline': {
                'delimiter': 'semi',
                'requireLast': true
            },
            'multilineDetection': 'brackets'
        }
    ],

    // Multiline comments formatting: prefer block comments.
    // '@stylistic/multiline-comment-style': ['error', 'starred-block'],

    // Multiline ternary operators formatting.
    '@stylistic/multiline-ternary': 'off',

    // Force new Class() style.
    '@stylistic/new-parens': ['error', 'always'],

    // Chaining.
    '@stylistic/newline-per-chained-call': [
        'error',
        {
            'ignoreChainWithDepth': 3
        },
    ],

    // Forbid code like: a && b || c. Should be a && (b || c) or (a && b) || c
    '@stylistic/no-mixed-operators': 'error',

    // Forbid mixed indents (spaces nad tabs).
    '@stylistic/no-mixed-spaces-and-tabs': 'error',

    // Forbid multiple spaces between operators.
    '@stylistic/no-multi-spaces': 'error',

    // Forbid multiple empty lines.
    '@stylistic/no-multiple-empty-lines': [
        'error',
        {
            // Не больше 2-х внутри файла.
            max: 2,
            // Не больше 1 в конце файла.
            maxEOF: 1
        }
    ],

    // Запрет использования табуляции.
    '@stylistic/no-tabs': 'error',

    // Запрет пробелов в конце строк.
    '@stylistic/no-trailing-spaces': 'warn',

    // Запрет 'obj. prop' (должно быть obj.prop).
    '@stylistic/no-whitespace-before-property': 'error',

    // Objects formatting.
    '@stylistic/object-curly-newline': [
        'error',
        {
            ObjectExpression: {
                multiline: true,
                consistent: true,
            },
            ObjectPattern: {
                consistent: true,
            },
            ImportDeclaration: {
                multiline: true,
                minProperties: 2,
                consistent: true,
            },
            ExportDeclaration: {
                multiline: true,
                minProperties: 3,
                consistent: true,
            },
        }
    ],
    '@stylistic/object-curly-spacing': ['error', 'never'],
    '@stylistic/object-property-newline': [
        'error',
        {
            allowAllPropertiesOnSameLine: true
        }
    ],

    // Forbid several var declarations in a single line.
    '@stylistic/one-var-declaration-per-line': ['error', 'always'],

    // How to format operators in multiline expressions.
    '@stylistic/operator-linebreak': ['error', 'before'],

    // New lines at the start and end of blocks.
    '@stylistic/padded-blocks': [
        'error',
        {
            switches: 'never',
            classes: 'start',
        }
    ],
    // New lines between code blocks.
    '@stylistic/padding-line-between-statements': [
        'error',
        {blankLine: 'always', prev: 'import', next: '*'},
        {blankLine: 'always', prev: 'cjs-import', next: '*'},
        {blankLine: 'never', prev: 'import', next: 'import'},
        {blankLine: 'never', prev: 'cjs-import', next: 'import'},
        {blankLine: 'never', prev: 'import', next: 'cjs-import'},
        {blankLine: 'never', prev: 'cjs-import', next: 'cjs-import'},

        {blankLine: 'always', prev: '*', next: 'cjs-export'},
        {blankLine: 'always', prev: '*', next: 'export'},

        {blankLine: 'always', prev: 'function', next: '*'},
        {blankLine: 'always', prev: 'class', next: '*'},
        {blankLine: 'always', prev: 'interface', next: '*'},
        {blankLine: 'always', prev: 'type', next: '*'},
        {blankLine: 'always', prev: '*', next: 'function'},
        {blankLine: 'always', prev: '*', next: 'class'},
        {blankLine: 'always', prev: '*', next: 'interface'},
        {blankLine: 'always', prev: '*', next: 'type'},
    ],

    // Quotes formatting.
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/quotes': ['error', 'single'],

    // Forbid space in '...rest' during object or array spread: [a, b, ...rest].
    '@stylistic/rest-spread-spacing': ['error', 'never'],

    // Forbid semicolons in expressions and declarations.
    '@stylistic/semi': ['error', 'never'],

    // Spaces before code blocks, function args, between operators, etc...
    '@stylistic/space-before-blocks': ['error', 'always'],
    '@stylistic/space-before-function-paren': [
        'error',
        {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
            catch: 'always',
        }
    ],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-unary-ops': [
        'error',
        {
            words: true,
            nonwords: false,
        }
    ],
    '@stylistic/spaced-comment': ['error', 'always'],
    '@stylistic/switch-colon-spacing': 'error',
    '@stylistic/template-curly-spacing': ['error', 'never'],
    '@stylistic/template-tag-spacing': ['error', 'always'],
    '@stylistic/type-annotation-spacing': [
        'error',
    ],
    '@stylistic/type-generic-spacing': 'error',
    '@stylistic/type-named-tuple-spacing': 'error',

    // Format immediate function calls: (function () {return 1;})()
    '@stylistic/wrap-iife': ['error', 'inside'],

    // Format yield* expressions to: yield * other()
    '@stylistic/yield-star-spacing': ['error', 'both'],

    // В функциональных компонентах React часто нужно использовать декларативный формат функций
    // и размещать их вне компонента, если они не влияют на состояние компонента.
    // Стрелочный вариант (const x = () => {}) требует объявления ДО использования, а это не удобно
    // т.к. код компонента оказывается в конце файла, и нужно туда скролить, тратя время.
    'func-style': [
        'error',
        'declaration',
        {
            allowArrowFunctions: true,
        }
    ],

    'object-shorthand': [
        'error',
        'always',
        {
            avoidExplicitReturnArrows: true,
        }
    ],

    // Больше мешает чем помогает: this.method() короче чем
    // this.constructor.method() + пихать всё что не использует this
    // в прототип класса - плохая идея.
    // 'class-methods-use-this': ['error'],
    'class-methods-use-this': 'off',
    'no-in': 'off',
    curly: ['error', 'all'],

    // Не дает использовать значения с типами, содержащими any.
    '@typescript-eslint/no-unsafe-assignment': 'off',
    // Явно указанные типы всегда лучше читаются.
    '@typescript-eslint/no-inferrable-types': 'off',
    // Иногда нужно использовать () => {}.
    '@typescript-eslint/no-empty-function': 'off',
    // Иногда нужно использовать @ts-ignore на пакетах, не имеющих типов для TypeScript.
    '@typescript-eslint/ban-ts-comment': 'off',
    // Не критично.
    '@typescript-eslint/ban-types': 'off',
    // Мешает указывать перечисление значений в смеси с простым типом: "blue" | "green" | string.
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    // Заставляет вставлять слишком много eslint-disable-next-line.
    '@typescript-eslint/no-unsafe-member-access': 'off',
    // Предпочитать interface вместо type.
    '@typescript-eslint/consistent-type-definitions': 'error',
    // Ругается на catch(e) {}, если e не используется внутри, а иногда не важно что там за ошибка.
    'no-unused-vars': 'off',

    // Настраиваем так, чтобы не ругалось на '_e'.
    '@typescript-eslint/no-unused-vars': [
        'error',
        {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
        }
    ],

    // Правила для React
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    // Начиная с React 17 требование импорта React в JSX файле неактуально.
    'react/react-in-jsx-scope': 'off',
    // Мешает делать сложные условия в хуках.
    'react-hooks/exhaustive-deps': 'off',

    '@stylistic/jsx-child-element-spacing': 'off',
    '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
    '@stylistic/jsx-closing-tag-location': ['error', 'line-aligned'],
    '@stylistic/jsx-curly-brace-presence': [
        'error',
        {
            props: 'never',
            children: 'never',
            propElementValues: 'always'
        }
    ],
    '@stylistic/jsx-curly-newline': [
        'error',
        {
            multiline: 'consistent',
            singleline: 'forbid'
        }
    ],
    '@stylistic/jsx-curly-spacing': [
        'error',
        {
            'when': 'never'
        }
    ],
    '@stylistic/jsx-equals-spacing': ['error', 'never'],
    '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
    '@stylistic/jsx-indent-props': ['error', 4],
    '@stylistic/jsx-max-props-per-line': 'error',
    '@stylistic/jsx-newline': 'off',
    '@stylistic/jsx-one-expression-per-line': 'off',
    '@stylistic/jsx-pascal-case': 'error',
    '@stylistic/jsx-quotes': ['error', 'prefer-double'],
    '@stylistic/jsx-self-closing-comp': 'error',
    // JSX component props sorting. Not sure that this rule is really needed.
    //'@stylistic/jsx-sort-props': "error"
    '@stylistic/jsx-tag-spacing': [
        'error',
        {
            closingSlash: 'never',
            beforeSelfClosing: 'always',
            afterOpening: 'never',
            beforeClosing: 'never',
        }
    ],
    '@stylistic/jsx-wrap-multilines': 'error',
}

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{ts,tsx,mjs,d.ts}'],
        ignores: [
            '**/app.min.js',
            '**/webpack.mix.js',
            '**/webpack.mix.css.js',
            '**/webpack.mix.frontend.js',
            '**/webpack.mix.management.js',
            '**/webpack.mix.admin.js',
            '**/webpack.mix.partials.js',
            '**/webpack.mix.copy-vendor-files.js',
            '**/webpack.mix.service-workers.js',
            '**/.eslintrc.js',
            // '**/eslint.config.mjs'
        ],
    },
    ...tsEslint.configs.recommended,
    ...tsEslint.configs.recommendedTypeChecked,
    importPlugin.flatConfigs.recommended,
    {
        plugins: {
            '@stylistic': stylistic
        },
    },
    // React and React Hooks.
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        // rules: {
        //     'react-hooks/exhaustive-deps': 'warn',
        //     'react-hooks/rules-of-hooks': 'error',
        // },
    },
    {
        languageOptions: {
            globals: globals.browser,

            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },

                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },

            react: {
                version: 'detect',
            },

            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`.
            // If this isn't set, any propTypes wrapped in a function will be skipped.
            propWrapperFunctions: [
                'forbidExtraProps',
                {
                    property: 'freeze',
                    object: 'Object',
                },
                {
                    property: 'myFavoriteWrapper',
                },
                {
                    property: 'forbidExtraProps',
                    exact: true,
                }
            ],

            // The name of any function used to wrap components, e.g., Mobx `observer` function.
            // If this isn't set, components wrapped by these functions will be skipped.
            componentWrapperFunctions: [
                'observer',
                {
                    property: 'styled',
                },
                {
                    property: 'observer',
                    object: 'Mobx',
                },
                {
                    property: 'observer',
                    object: '<pragma>',
                }
            ],
            // Components used as alternatives to <form> for forms, e.g. <Form endpoint={ url } />
            formComponents: [
                'CustomForm',
                {
                    name: 'Form',
                    formAttribute: 'endpoint',
                }
            ],
            // Components used as alternatives to <a> for linking, e.g. <Link to={ url } />
            linkComponents: [
                'Hyperlink',
                {
                    name: 'Link',
                    linkAttribute: 'to',
                },
                {
                    name: 'NavLink',
                    linkAttribute: 'to',
                }
            ],
        },

        rules,
    }
]
