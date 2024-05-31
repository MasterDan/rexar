import { Ref, defineComponent, ref } from '@rexar/core';
import { map } from 'rxjs';
import { FadeKeys, TransitionFade } from './fade.transition';

const Row = defineComponent<{ title: string }>(({ children, title }) => (
  <>
    <h4>{title}</h4>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {children}
    </div>
  </>
));

export const TransitionFadeExample = defineComponent(() => {
  const visible$ = ref(true);
  const visibleSecond$ = ref(true);
  const visibleThird$ = ref(false);

  const toStateKeys = (flag$: Ref<boolean>) =>
    flag$.pipe(map((v): FadeKeys => (v ? 'default' : 'void')));
  const toggle = (flag$: Ref<boolean>) => () => {
    flag$.value = !flag$.value;
  };
  return (
    <>
      <Row title="Simple Fade transition">
        <button onClick={toggle(visible$)}>Toggle visibility</button>
        <TransitionFade
          state={toStateKeys(visible$)}
          content={() => <span>I will fade</span>}
        />
      </Row>
      <Row title="Same, but appearing on start">
        <button onClick={toggle(visibleSecond$)}>Toggle visibility</button>
        <TransitionFade
          initialState="void"
          state={toStateKeys(visibleSecond$)}
          content={() => <span>I will fade and appear first</span>}
        />
      </Row>
      <Row title="Or disappearing">
        <button onClick={toggle(visibleThird$)}>Toggle visibility</button>
        <TransitionFade
          initialState="default"
          state={toStateKeys(visibleThird$)}
          content={() => <span>I will fade and disappear first</span>}
        />
      </Row>
    </>
  );
});
