import { ref$ } from '@core/reactivity/ref';
import { Observable, take } from 'rxjs';
import { IBinding } from '../html/@types/binding-target';

export abstract class HtmlRendererBase {
  public target$ = ref$<IBinding>();

  public nextTarget$ = ref$<IBinding>();

  abstract renderInto(target: IBinding): Observable<IBinding | undefined>;

  public render() {
    if (this.target$.val == null) {
      return;
    }
    this.renderInto(this.target$.val)
      .pipe(take(1))
      .subscribe((nt) => {
        this.nextTarget$.val = nt ?? this.target$.val;
      });
  }
}
