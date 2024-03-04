import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  title: 'Rexar',
  lang: 'en',
  description: 'ReactiveX Advanced Renderer',

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [{ text: 'Guide', link: '/guide/' }],

        sidebar: {
          '/guide/': [
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'Component syntax',
              link: '/guide/component-syntax',
              items: [
                {
                  text: 'Passing Props',
                  link: '/guide/props-and-children',
                },
                {
                  text: 'Subscribing Events',
                  link: '/guide/event-handling',
                },
                {
                  text: 'Styling components',
                  link: '/guide/classes-and-styles',
                },
                {
                  text: 'Conditional Rendering',
                  link: '/guide/conditional-rendering',
                },
                {
                  text: 'List Rendering',
                  link: '/guide/list-rendering',
                },
              ],
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
  },
});

