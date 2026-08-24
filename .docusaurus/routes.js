import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '94e'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '89b'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'a89'),
            routes: [
              {
                path: '/example',
                component: ComponentCreator('/example', '2ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'fc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', '905'),
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
