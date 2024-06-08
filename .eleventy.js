const syntaxHighlight  = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt       = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

module.exports = function(eleventyConfig) {
    /* ----------------
        -- Plugins
    ---------------- */

    // SyntaxHighlighter
    eleventyConfig.addPlugin(syntaxHighlight);


    /* ----------------
        -- General settings
    ---------------- */

    // To enable merging of tags
    eleventyConfig.setDataDeepMerge(true);

    // Copy these static files to _site folder
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPassthroughCopy('src/manifest.json');

    // To create excerpts
    eleventyConfig.setFrontMatterParsingOptions({
        excerpt: true,
        excerpt_alias: 'post_excerpt',
        excerpt_separator: '<!-- excerpt -->'
    });


    /* ----------------
        -- FILTERS
    ---------------- */

    // Determinate reading time
    eleventyConfig.addFilter('readTime', (value) => {
        const content            = value;
        const textOnly           = content.replace(/(<([^>]+)>)/gi, '');
        const readingSpeedPerMin = 450;

        return Math.max(1, Math.floor(textOnly.length / readingSpeedPerMin));
    });


    eleventyConfig.addFilter('theTitle', (post) => {
        if (post.url === '/') return 'Home';
        return 'wtf';
    });


    // Enable iteration over all the tags excluding posts and all.
    eleventyConfig.addCollection('tagList', collection => {
        const tagsSet = new Set();

        collection.getAll().forEach(item => {
            if (!item.data.tags) return
            item.data.tags
                .filter(tag => !['posts', 'all'].includes(tag))
                .forEach(tag => tagsSet.add(tag))
        });

        return Array.from(tagsSet).sort();
    });


    // Add header anchor to all h1 and h2 tags
    const md = markdownIt({ html: true, linkify: true });
    md.use(markdownItAnchor, {
        level: [1, 2],
        permalink: markdownItAnchor.permalink.headerLink({
            safariReaderFix: true,
            class: 'header-anchor',
        })
    })
    eleventyConfig.setLibrary('md', md)


    // Implement asset_img shortcode
    eleventyConfig.addLiquidShortcode('asset_img', (filename, alt) => {
        return `<img class="my-4 h-auto max-w-full" src="/assets/img/posts/${filename}" alt="${alt}" />`
    });

    return {
        dir: {
            input: 'src'
        }
    };
};
