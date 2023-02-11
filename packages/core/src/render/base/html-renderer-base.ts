import { ref$ } from '@core/reactivity/ref';
import { Observable, take } from 'rxjs';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { IBinding } from '../html/@types/binding-target';

export abstract class HtmlRendererBase {
  public target$ = ref$<IBinding>();

  public nextTarget$ = ref$<IBinding>();

  abstract renderInto(target: IBinding): Observable<IBinding | undefined>;

  public async render() {
    if (this.target$.val == null) {
      return;
    }
    const nextTarget = await lastValueFrom(
      this.renderInto(this.target$.val).pipe(take(1)),
    );
    this.nextTarget$.val = nextTarget ?? this.target$.val;
  }
}
