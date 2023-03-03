import { CustomComponentHooks } from '@core/components/builtIn/custom/custom-component-hooks';
import { CustomComponent } from '@core/components/builtIn/custom/custom-template-component';
import { listComponent } from '@core/components/builtIn/list.component';
import { TData } from '@core/components/component';
import { HooksLab } from '@core/tools/hooks';
import { ISetupContext } from 'packages/core/dist/types';
import { from, Observable, of, switchMap } from 'rxjs';
import { container } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { RefStore } from '../ref-store/ref-store';

export class CustomRendererHtml extends HtmlRendererBase {
  private hooksLab: HooksLab<
    ISetupContext<TData>,
    void,
    CustomComponentHooks
  > | null = null;

  constructor(private refStore: RefStore) {
    super();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!(this.component instanceof CustomComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomComponent;
    if (this.hooksLab == null) {
      const prepObj = component.setup();
      if (prepObj) {
        const { executeSetup, hooksLab } = prepObj;
        this.hooksLab = hooksLab;
        executeSetup();
      }
    }
    const renderAsync = async (): Promise<Observable<IBinding | undefined>> => {
      let template!: AnyComponent[];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.refStore.beginScope(component.name!);
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
        this.refStore.endScope();
        return renderer.nextTarget$;
      }
      if (template.length > 1) {
        const componentTemplate = listComponent.create();
        componentTemplate.bindProp('content', template);
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        renderer.setComponent(componentTemplate);
        renderer.target$.val = target;
        await renderer.render();
        this.refStore.endScope();
        return renderer.nextTarget$;
      }
      return of(undefined);
    };
    return from(renderAsync()).pipe(switchMap((x) => x));
  }
}
