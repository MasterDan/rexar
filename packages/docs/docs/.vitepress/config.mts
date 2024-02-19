import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  title: 'Simple Reactivity',
  lang: 'en',

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Examples', link: '/markdown-examples' },
          { text: 'Guide', link: '/guide/' },
          { text: 'Reactivity', link: '/reactivity/' },
        ],

        sidebar: {
          '/guide/': [
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'Component syntax',
              link: '/guide/component-syntax',
            },
            {
              text: 'Conditional rendering',
              link: '/guide/conditional-rendering',
            },
          ],
          '/reactivity/': [
            {
              text: 'Reactivity',
              link: '/reactivity/',
            },
            {
              text: 'Refs',
              link: '/reactivity/refs',
            },
            {
              text: 'Emitters',
              link: '/reactivity/emitters',
            },
            {
              text: 'Observables',
              link: '/reactivity/observables',
            },
          ],
        },

        socialLinks: [
          { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
        ],
      },
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Home', link: '/ru/' },
          { text: 'Examples', link: '/markdown-examples' },
          { text: 'Реактивность', link: '/ru/observables' },
        ],

        sidebar: [
          {
            text: 'Примеры',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Runtime API Examples', link: '/api-examples' },
            ],
          },
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
        ],
      },
    },
  },
  description: 'A js library',
});

