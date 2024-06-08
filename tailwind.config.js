import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export const theme = {
    colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: colors.red,
        dbg: '#f0f0f0',
        dbb: 'rgb(210,210,210)',
        dt: '#112a3d',
        dtt: 'rgb(37,37,37)',
        dbe: 'rgba(255,255,255,.8)',
    },
    extend: {
        typography: {
            DEFAULT: {
                css: {
                    maxWidth: '100ch'
                }
            }
        }
    }
}
export const content = ['./src/**/*.md', './src/**/*.html', './src/_includes/**/*.liquid', '.eleventy.js']
export const plugins = [
    require('@tailwindcss/typography')
]
