import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars = {
  docs: [
    {
        type: 'category',
	label: 'FTHPC Lab Compute Resources',
        collapsible: true,
	collapsed: false,
	items: [
	    {
	      type: 'category',
              label: 'Olympus',
              collapsible: true,
              collapsed: false,
              items: [
		{
		  type: 'category',
                  label: 'Docs',
                  items: [
                    'olympus/account-registration',
                    'olympus/nodes',
                    'olympus/spack',
                    'olympus/slurm',
                  ],
                },
              ],
            },
          {
            type: 'category',
            label: 'Foothills',
	    collapsible: true,
            collapsed: false,
            items: [
              {
                type: 'category',
		label: 'Docs',
                items: [
		  'foothills/example-foothills',
		],
              },
            ],
          },
        ],
      },
      'example',
    ],
};


export default sidebars;
