import { readonly, ref$ } from '@/reactivity/ref';
import { IBinding } from '../@types/binding-target';

export class ComponentRendererHtml {
  targetPrevious$ = readonly(ref$<IBinding>());

  targetNext$ = ref$<IBinding>();
}
