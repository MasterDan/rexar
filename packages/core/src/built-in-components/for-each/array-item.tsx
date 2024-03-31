import { Ref, ref } from '@rexar/reactivity';
import { ComponentRenderFunc, defineComponent, render } from '@core/component';
import { Comment } from '../comment';
import { EachComponent, Key } from './@types';

export class ArrayItem<T> {
  endAnchor?: JSX.Element;

  private $remove?: () => void;

  itemRef: Ref<T>;

  indexRef: Ref<number>;

  private component?: ComponentRenderFunc;

  constructor(item: T, public key: Key, index: number) {
    this.itemRef = ref(item);
    this.indexRef = ref(index);
  }

  remove() {
    if (this.$remove == null) {
      throw new Error('Cannot remove element that not been rendered');
    }
    this.$remove();
  }

  render(Elem: EachComponent<T>) {
    const after = (elem: JSX.Element) => {
      this.endAnchor ??= <Comment text="end-of-element"></Comment>;
      this.component ??= defineComponent(() => (
        <>
          <Elem item={this.itemRef} index={this.indexRef}></Elem>
          {this.endAnchor}
        </>
      ));
      const { remove } = render(this.component).after(elem);
      this.$remove = remove;
      return this.endAnchor;
    };
    return { after };
  }
}
