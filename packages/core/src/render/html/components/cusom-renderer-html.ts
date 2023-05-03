import { CustomComponent } from '@core/components/builtIn/custom/custom-template-component';
import { listComponent } from '@core/components/builtIn/list.component';
import { hookScope } from '@core/tools/hooks/hooks';

import {
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { container, injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { RefStore } from '../ref-store/ref-store';

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
    if (!(this.component instanceof CustomComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomComponent;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.refStore.beginScope(this.component.name!);
    const { track$, end } = hookScope.beginScope();
    track$
      .pipe(
        filter(
          ({ name, params }) =>
            name === 'reference' &&
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
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        this.renderer = renderer;
        renderer.setComponent(componentTemplate);
        renderer.target$.val = target;
        await renderer.render();
        return renderer.nextTarget$;
      }
      if (template.length > 1) {
        const componentTemplate = listComponent.create();
        componentTemplate.bindProp('content', template);
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        this.renderer = renderer;
        renderer.setComponent(componentTemplate);
        renderer.target$.val = target;
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
