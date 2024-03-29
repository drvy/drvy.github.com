module.exports = {
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '100ch'
                    }
                }
            }
        }
    },
    darkMode: 'class',
    content: ['./src/**/*.md', './src/**/*.html', './src/_includes/**/*.liquid'],
    plugins: [
        require('@tailwindcss/typography')
    ],
}
