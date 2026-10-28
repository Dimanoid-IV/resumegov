import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Hub from '../../src/app/federal-resume-examples/page.tsx';
import GS5 from '../../src/app/federal-resume-examples/gs-5/page.tsx';
import GS7 from '../../src/app/federal-resume-examples/gs-7/page.tsx';
import GS9 from '../../src/app/federal-resume-examples/gs-9/page.tsx';
import GS11 from '../../src/app/federal-resume-examples/gs-11/page.tsx';
import IT2210 from '../../src/app/federal-resume-examples/2210-it-specialist/page.tsx';
import Analyst0343 from '../../src/app/federal-resume-examples/0343-management-analyst/page.tsx';
import Accountant0510 from '../../src/app/federal-resume-examples/0510-accountant/page.tsx';
import Officer0301 from '../../src/app/federal-resume-examples/0301-administrative-officer/page.tsx';

const pages = [
  ['hub', Hub],
  ['GS-5', GS5],
  ['GS-7', GS7],
  ['GS-9', GS9],
  ['GS-11', GS11],
  ['2210', IT2210],
  ['0343', Analyst0343],
  ['0510', Accountant0510],
  ['0301', Officer0301],
];

for (const [name, Page] of pages) {
  test(`${name} example page sends visitors to the working resume check`, () => {
    const html = renderToStaticMarkup(createElement(Page.default));
    assert.match(html, /href="\/start\?source=examples(?:%3A|:)\w+"/);
    assert.doesNotMatch(html, /href="\/builder"/);
  });

  test(`${name} example page explains the current two-page rule with an official source`, () => {
    const html = renderToStaticMarkup(createElement(Page.default));
    assert.match(html, /two pages or less/i);
    assert.match(html, /help\.usajobs\.gov\/faq\/application\/documents\/resume\/what-to-include/);
    assert.doesNotMatch(html, /three to five pages|four to six pages|five to eight pages|passes HR screening|lands you interviews|ensures your resume/i);
  });
}

test('GS-5 and GS-9 qualification guidance does not overstate experience or credit 60 semester hours alone', () => {
  const gs5 = renderToStaticMarkup(createElement(GS5.default));
  const gs9 = renderToStaticMarkup(createElement(GS9.default));
  assert.doesNotMatch(gs5, /require either 60 semester hours/i);
  assert.doesNotMatch(gs9, /two (full )?years of (progressively responsible )?specialized experience|over at least two years|two years of experience/i);
  assert.match(gs9, /one year of specialized experience equivalent to GS-7/i);
});
