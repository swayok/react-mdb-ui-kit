import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default tsEslint.config(
    {
        // files: ['**/*.{ts,tsx}'],
        ignores: [
            '**/.eslintrc.js',
            '**/eslint.config.mjs'
        ],
    },
    pluginJs.configs.recommended,
    tsEslint.configs.recommendedTypeChecked,
    // Rules considered to be the best practice for modern TypeScript codebases,
    // but that do not impact program logic.
    // These rules are generally opinionated about enforcing simpler code patterns.
    tsEslint.configs.stylisticTypeChecked,
    // React and React Hooks.
    pluginReact.configs.flat.recommended,
    reactHooks.configs['recommended-latest'],
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
                project: ['./tsconfig.json'],
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

        rules: {
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                }
            ],

            'arrow-parens': ['error', 'as-needed'],
            semi: ['error', 'never'],
            quotes: ['error', 'single'],

            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always',
                }
            ],

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

            'arrow-body-style': ['error', 'as-needed'],

            'object-shorthand': [
                'error',
                'always',
                {
                    avoidExplicitReturnArrows: true,
                }
            ],

            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'never',
                }
            ],

            // Больше мешает чем помогает: this.method() короче чем
            // this.constructor.method() + пихать всё что не использует this
            // в прототип класса - плохая идея.
            // 'class-methods-use-this': ['error'],
            'class-methods-use-this': 'off',
            'no-in': 'off',
            curly: ['error', 'all'],

            'max-statements-per-line': [
                'error',
                {
                    max: 1,
                }
            ],

            'react/jsx-uses-vars': 'error',
            'react/jsx-uses-react': 'error',
            // Начиная с React 17 требование импорта React в JSX файле неактуально.
            'react/react-in-jsx-scope': 'off',
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
            // Мешает делать сложные условия в хуках.
            'react-hooks/exhaustive-deps': 'off',
            // Заставляет вставлять слишком много eslint-disable-next-line.
            '@typescript-eslint/no-unsafe-member-access': 'off',
            // Непонятно какой смысл в использовании Regexp.exec() вместо string.match(Regexp)
            '@typescript-eslint/prefer-regexp-exec': 'off',
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
        },
    }
)
