import { defineComponent } from '.';

interface ITestProps {
  n: number;
  s: string;
  obj: { n: number; s: string };
  lst: { n: number; s: string }[];
}

describe('component class', () => {
  test('read props', () => {
    const { create } = defineComponent<ITestProps>({
      props: () => ({
        n: 100,
        s: 'hello',
        obj: { n: 101, s: 'i-m-obj' },
        lst: [{ n: 103, s: 'lst-1' }],
      }),
    });
    const inst = create();
    expect(inst.getProp('n')).toBe(100);
    expect(inst.getProp('obj')).toEqual({ n: 101, s: 'i-m-obj' });
  });
  test('bind props', () => {
    const inst = defineComponent<ITestProps>({
      props: () => ({
        lst: [],
        n: 0,
        obj: { n: 0, s: '' },
        s: '',
      }),
    }).create();
    inst.bindProp('n', 20);
    expect(inst.getProp('n')).toBe(20);
  });
});
