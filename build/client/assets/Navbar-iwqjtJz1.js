import { x as n, v as o, o as t, t as e } from './chunk-QMGIS6GS-DX0VMMAr.js';
const l = () => {
  const a = n(),
    s = o();
  return t.jsxs('nav', {
    className: 'navbar flex items-center justify-between max-md:flex-col text-center gap-4 ',
    children: [
      t.jsx(e, {
        to: '/',
        children: t.jsx('p', {
          className: 'text-2xl max-md:text-xl font-bold text-gradient',
          children: 'ATS RESUME ANALYZER',
        }),
      }),
      t.jsx('div', {
        className: 'flex items-center gap-4',
        children:
          a.pathname === '/upload'
            ? t.jsx('button', {
                onClick: () => s(-1),
                className: 'primary-button w-fit',
                children: '← Back',
              })
            : t.jsx(e, {
                to: '/upload',
                className: 'primary-button w-fit',
                children: 'Upload Your Resume',
              }),
      }),
    ],
  });
};
export { l as N };
