import { Ref, ref } from '@rexar/reactivity';
import { ComponentRenderFunc, defineComponent, render } from '@core/component';
import { RenderContext } from '@core/scope/context';
import { Comment } from '../comment';
import { EachComponent, Key } from './@types';
import { Waiter } from '../dynamic/waiter';

export class ArrayItem<T> {
  endAnchor?: JSX.Element;

  private $remove?: () => Promise<void>;

  itemRef: Ref<T>;

  indexRef: Ref<number>;

  private component?: ComponentRenderFunc;

  private waiter = new Waiter();

  constructor(
    item: T,
    public key: Key,
    index: number,
    private context: RenderContext,
  ) {
    this.itemRef = ref(item);
    this.indexRef = ref(index);
  }

  async remove() {
    if (this.$remove == null) {
      throw new Error('Cannot remove element that not been rendered');
    }
    return this.$remove();
  }

  render(Elem: EachComponent<T>) {
    const after = (elem: JSX.Element) => {
      this.endAnchor ??= <Comment text="end-of-element"></Comment>;
      this.component ??= defineComponent(() => (
        <>
          <Elem
            item={this.itemRef}
            index={this.indexRef}
            waiter={this.waiter}
          ></Elem>
          {this.endAnchor}
        </>
      ));
      const { remove } = render(this.component, this.context).after(elem);
      this.$remove = () =>
        this.waiter.waitEveryone().then(() => {
          remove();
        });
      return this.endAnchor;
    };
    return { after };
  }
}
