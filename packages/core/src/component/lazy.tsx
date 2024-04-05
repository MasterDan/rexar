import { ComponentRenderFunc, defineComponent } from '@core/component';
import { AnyRecord } from '@rexar/tools';
import { useDynamic } from '@core/built-in-components/dynamic';
import { combineLatestWith, from, timer } from 'rxjs';

export function defineLazyComponent<T extends AnyRecord = AnyRecord>(
  arg: () => Promise<ComponentRenderFunc<T>>,
  {
    fallback,
    timeout,
  }: { fallback?: () => JSX.Element; timeout?: number } = {},
) {
  return defineComponent<T>((props) => {
    const [Content, setContent] = useDynamic(fallback);
    from(arg())
      .pipe(combineLatestWith(timer(timeout ?? 0)))
      .subscribe(([component]) => {
        setContent(() => component(props));
      });

    return <Content />;
  });
}

