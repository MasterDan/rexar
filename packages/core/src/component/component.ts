import { BaseProps } from '@rexar/jsx';
import { ref, toRef } from '@rexar/reactivity';
import { ComponentHookName, renderingScope } from '@core/scope';
import {
  Subject,
  distinctUntilChanged,
  filter,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { RenderingScopeValue } from '@core/scope/scope-value';
import { RenderContext } from '@core/scope/context';

enum Lifecycle {
  Created,
  Rendered,
  Mounted,
  BeforeDestroy,
  Destroyed,
}

export type ComponentOptions = {
  root: boolean;
  destroyer?: Subject<void>;
  context?: RenderContext;
};

export class Component<TProps extends BaseProps> {
  key = Symbol('component');

  private hooks = new Map<ComponentHookName, Subject<void>[]>();

  private parentContext: RenderContext | undefined;

  private setHook(name: ComponentHookName, body: Subject<void>) {
    let hooks = this.hooks.get(name);
    if (hooks == null) {
      const nh: Subject<void>[] = [];
      this.hooks.set(name, nh);
      hooks = nh;
    }
    hooks.push(body);
  }

  private parentLifecycle = ref<Lifecycle>();

  private $lifecycle = ref(Lifecycle.Created);

  get lifecycle$() {
    return toRef(this.$lifecycle);
  }

  constructor(private renderFunc: (props: TProps) => JSX.Element) {
    this.parentContext = renderingScope.current?.value.context;
    const parentLifecycle = renderingScope.current?.value.component.lifecycle$;
    const destroy$ = this.$lifecycle.pipe(
      filter((l) => l === Lifecycle.Destroyed),
    );
    if (parentLifecycle != null) {
      this.parentLifecycle
        .pipe(
          filter((lc): lc is Lifecycle => lc != null),
          takeUntil(destroy$),
        )
        .subscribe((parentLc) => {
          if (
            parentLc === Lifecycle.Mounted &&
            this.lifecycle$.value === Lifecycle.Rendered
          ) {
            this.$lifecycle.value = Lifecycle.Mounted;
          } else if (parentLc === Lifecycle.BeforeDestroy) {
            this.$lifecycle.value = Lifecycle.BeforeDestroy;
          } else if (parentLc === Lifecycle.Destroyed) {
            this.$lifecycle.value = Lifecycle.Destroyed;
          }
        });

      parentLifecycle.subscribe((value) => {
        this.parentLifecycle.value = value;
      });
    }

    this.lifecycle$
      .pipe(takeUntil(destroy$), distinctUntilChanged())
      .subscribe((value) => {
        let hookToTrigger: ComponentHookName | undefined;
        if (value === Lifecycle.Rendered) {
          hookToTrigger = 'onRendered';
        } else if (value === Lifecycle.Mounted) {
          hookToTrigger = 'onMounted';
        } else if (value === Lifecycle.BeforeDestroy) {
          hookToTrigger = 'onBeforeDestroy';
        } else if (value === Lifecycle.Destroyed) {
          hookToTrigger = 'onDestroyed';
        }
        if (hookToTrigger) {
          this.hooks.get(hookToTrigger)?.forEach((hook) => {
            hook.next();
            hook.complete();
          });
          this.hooks.delete(hookToTrigger);
        }
      });
  }

  render(props: TProps, { root, destroyer }: ComponentOptions) {
    const catchHooks = renderingScope.begin(
      this.key,
      new RenderingScopeValue(
        this,
        this.parentContext?.createChildContext() ?? new RenderContext(),
      ),
    );
    catchHooks.subscribe((hook) => {
      this.setHook(hook.name as ComponentHookName, hook.body);
    });
    const result = this.renderFunc(props);

    const renderedNodes: ChildNode[] =
      result instanceof DocumentFragment ? [...result.childNodes] : [result];

    destroyer?.subscribe(() => {
      this.$lifecycle.value = Lifecycle.BeforeDestroy;
      renderedNodes.forEach((n) => {
        n.remove();
      });
      this.$lifecycle.value = Lifecycle.Destroyed;
    });

    if (root) {
      timer(10, 50)
        .pipe(
          take(10),
          filter(() => renderedNodes.every((n) => n.isConnected)),
          take(1),
        )
        .subscribe(() => {
          this.$lifecycle.value = Lifecycle.Mounted;
        });
    } else {
      this.$lifecycle.value = Lifecycle.Rendered;
    }
    renderingScope.end();
    return result;
  }
}
