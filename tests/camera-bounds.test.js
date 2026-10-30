import test from 'node:test';
import assert from 'node:assert/strict';
import {confineInteriorCamera, INTERIOR_BOUNDS as b} from '../src/camera-bounds.js';

test('interior viewpoints stay unchanged', () => {
  const position = {x:-12,y:3.1,z:14.8}, target = {x:1,y:2.5,z:-8};
  confineInteriorCamera(position,target);
  assert.deepEqual(position,{x:-12,y:3.1,z:14.8});
  assert.deepEqual(target,{x:1,y:2.5,z:-8});
});

test('camera and pan target cannot escape any face of the room', () => {
  for (const axis of ['x','y','z']) for (const sign of [-1,1]) {
    const position={x:0,y:3,z:0},target={x:0,y:3,z:0};
    position[axis]=sign*1000;target[axis]=sign*1000;
    confineInteriorCamera(position,target);
    const expected=b[(sign<0?'min':'max')+axis.toUpperCase()];
    assert.equal(position[axis],expected);assert.equal(target[axis],expected);
  }
});

test('repeated combined pan, orbit and zoom excursions stay inside', () => {
  const position={x:0,y:3,z:0},target={x:0,y:3,z:0};
  for(let i=0;i<2000;i++) {
    position.x+=Math.sin(i)*50;position.y+=Math.cos(i)*30;position.z+=Math.cos(i*.7)*70;
    target.x-=19;target.y+=9;target.z+=31;
    confineInteriorCamera(position,target);
    for(const v of [position,target]) for(const a of ['x','y','z']) {
      assert.ok(v[a]>=b['min'+a.toUpperCase()] && v[a]<=b['max'+a.toUpperCase()]);
    }
  }
});
