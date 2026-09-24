import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '17f'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '008'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'e54'),
            routes: [
              {
                path: '/example',
                component: ComponentCreator('/example', 'cfe'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/foothills/example-foothills',
                component: ComponentCreator('/foothills/example-foothills', 'f01'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/olympus/account-registration',
                component: ComponentCreator('/olympus/account-registration', '04f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/olympus/nodes',
                component: ComponentCreator('/olympus/nodes', '7e9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/olympus/slurm',
                component: ComponentCreator('/olympus/slurm', '1b8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/olympus/spack',
                component: ComponentCreator('/olympus/spack', '3d0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/',
                component: ComponentCreator('/', '8e6'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
