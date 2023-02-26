import { CustomComponent } from '@core/components/builtIn/custom/custom-template-component';
import { listComponent } from '@core/components/builtIn/list.component';
import { from, Observable, of, switchMap } from 'rxjs';
import { container } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';

export class CustomRendererHtml extends HtmlRendererBase {
  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!(this.component instanceof CustomComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomComponent;
    const r = async (): Promise<Observable<IBinding | undefined>> => {
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
    return from(r()).pipe(switchMap((x) => x));
  }
}
