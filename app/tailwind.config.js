module.exports = {
    mode: 'jit',
    // These paths are just examples, customize them to match your project structure
    purge: ['./src/**/*.{html,ts}', './src/app/*.{html,ts}'],
    content: ['./src/**/*.{html,ts}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {}
    },
    plugins: [require('flowbite/plugin')]
};
