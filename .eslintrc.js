module.exports = {
    root: true,
    extends: ['@react-native-community', 'eslint-config-prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['prettier', 'react-native'],
    ignorePatterns: ['.eslintrc.js'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        jsx: true,
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-shadow': ['error'],
                'no-shadow': 'off',
                'no-undef': 'off',
                'react-native/no-inline-styles': 0,
                'prettier/prettier': [
                    'error',
                    {
                        'no-inline-styles': false,
                    },
                ],
            },
        },
    ],
};
