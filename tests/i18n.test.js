import test from 'node:test';
import assert from 'node:assert/strict';
import {BM,t,setLanguage} from '../src/i18n.js';
import {LAYOUT_CONTROLS} from '../src/layout-settings.js';
test('all dynamic layout labels have BM translations',()=>{
 for(const fields of Object.values(LAYOUT_CONTROLS))for(const field of fields){assert.ok(BM[field.label]);assert.ok(BM[field.label+' slider'])}
});
test('language switching translates and restores both original and translated labels',()=>{
 setLanguage('bm');assert.equal(t('Chairs per table'),'Kerusi setiap meja');assert.equal(t('Kerusi setiap meja'),'Kerusi setiap meja');assert.equal(t('320'),'320');
 setLanguage('en');assert.equal(t('Kerusi setiap meja'),'Chairs per table');assert.equal(t('Chairs per table'),'Chairs per table');
});

test('Majestic copy translates and room identity stays consistent',()=>{setLanguage('bm');assert.equal(t('ROOM DIMENSIONS'),'UKURAN DEWAN');assert.equal(t('The Majestic Ballroom'),'The Majestic Ballroom');setLanguage('en');assert.equal(t('UKURAN DEWAN'),'ROOM DIMENSIONS')});
