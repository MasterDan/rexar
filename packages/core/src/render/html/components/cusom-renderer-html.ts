import { CustomComponent } from '@core/components/builtIn/custom/custom-template-component';
import { listComponent } from '@core/components/builtIn/list.component';

import { filter, from, Observable, of, switchMap, tap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { RefStore } from '../ref-store/ref-store';

@injectable()
export class CustomRendererHtml extends HtmlRendererBase {
  constructor(private refStore: RefStore) {
    super();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!(this.component instanceof CustomComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomComponent;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.refStore.beginScope(this.component.name!);
    if (this.hooksLab == null) {
      const prepObj = component.setup();
      if (prepObj) {
        const { executeSetup, hooksLab } = prepObj;
        this.hooksLab = hooksLab;
        // todo
        this.hooksLab.onHookAdd$
          .pipe(filter(({ name }) => name === 'reference'))
          .subscribe((h) => {
            const {
              value: { id, ref },
            } = h.hook as DataHook<IElementRefHook>;
            const storage = this.refStore.getCurrentScopeComponentHooks(id);
            storage.reference.el
              .pipe(filter((x): x is HTMLElement => x != null))
              .subscribe((el) => {
                ref.val = el;
              });
          });
        executeSetup();
      }
    }
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
        renderer.setComponent(componentTemplate);
        renderer.target$.val = target;
        await renderer.render();
        return renderer.nextTarget$;
      }
      if (template.length > 1) {
        const componentTemplate = listComponent.create();
        componentTemplate.bindProp('content', template);
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
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
