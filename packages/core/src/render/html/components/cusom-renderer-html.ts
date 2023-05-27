import { CustomTemplateComponent } from '@core/components/builtIn/custom/custom-template-component';
import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { IMountComponentHookParams } from '@core/components/builtIn/custom/hooks/mount-component.hook';
import { list } from '@core/components/builtIn/list.component';
import { ComponentType } from '@core/components/component-type';
import { hookScope } from '@core/tools/hooks/hooks';

import {
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { RefStore } from '../ref-store/ref-store';
import { resolveRenderer } from '../tools';

@injectable()
export class CustomRendererHtml extends HtmlRendererBase {
  private renderer: IHtmlRenderer | undefined;

  constructor(private refStore: RefStore) {
    super();
  }

  async unmount(): Promise<void> {
    if (this.renderer == null) {
      throw new Error('Cannot unmout component that has not been rendered');
    }
    await this.renderer.unmount();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!(this.component instanceof CustomTemplateComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomTemplateComponent;
    this.refStore.beginScope(this.component.type);
    const { track$, end } = hookScope.beginScope();
    track$
      .pipe(
        filter(
          ({ name, params }) =>
            name === BuiltInHooks.ElementReference &&
            params.id != null &&
            typeof params.id === 'string',
        ),
        mergeMap(({ params: { id }, trigger$ }) => {
          const { reference } = this.refStore.getReferences(id);
          return reference.el.pipe(
            filter((x): x is HTMLElement => x != null),
            map((el) => ({ el, trigger$ })),
          );
        }),
      )
      .subscribe(({ el, trigger$ }) => {
        trigger$.next(el);
      });
    track$
      .pipe(
        filter(({ name }) => name === BuiltInHooks.MountComponent),
        map(
          ({ params, trigger$ }) =>
            ({ params, trigger$ } as {
              params: IMountComponentHookParams;
              trigger$: Subject<AnyComponent>;
            }),
        ),
      )
      .subscribe(({ params, trigger$ }) => {
        const { transformer } = this.refStore.getReferences(params.id);
        transformer.append((c) => {
          if (c.type !== ComponentType.HTMLElement) {
            return c;
          }
          const newComponent = params.componentOrDefinition.create();
          trigger$.next(newComponent);
          if (c.getProp('name') !== 'SLOT') {
            c.bindProp('children', [newComponent]);
            return c;
          }
          return newComponent;
        });
      });

    component.setup();
    end();

    const renderAsync = async (): Promise<Observable<IBinding | undefined>> => {
      let template!: AnyComponent[];
      if (typeof component.template === 'string') {
        const { parseHtml } = await import('@core/parsers/html');
        template = await parseHtml(component.template);
      } else {
        template = component.template;
      }
      if (template.length === 1) {
        const [componentTemplate] = template;
        const renderer = resolveRenderer(componentTemplate, target);
        this.renderer = renderer;
        await renderer.render();
        return renderer.nextTarget$;
      }
      if (template.length > 1) {
        const componentTemplate = list(template);
        const renderer = resolveRenderer(componentTemplate, target);
        this.renderer = renderer;
        await renderer.render();
        return renderer.nextTarget$;
      }
      return of(undefined);
    };
    return from(renderAsync()).pipe(
      switchMap((x) => x),
      tap(() => {
        this.refStore.endScope();
      }),
    );
  }
}
