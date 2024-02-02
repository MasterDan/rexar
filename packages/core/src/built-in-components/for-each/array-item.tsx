import { Ref, ref } from '@rexar/reactivity';
import { render } from '@core/component';
import { h, fragment } from '@rexar/jsx';
import { Comment } from '../comment';
import { EachComponent, Key } from './@types';

export class ArrayItem<T> {
  endAnchor?: JSX.Element;

  private $remove?: () => void;

  itemRef: Ref<T>;

  indexRef: Ref<number>;

  constructor(
    item: T,
    public key: Key,
    index: number,
  ) {
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
      const endAnchor = <Comment text="end-of-element"></Comment>;
      const Body = () => (
        <>
          <Elem item={this.itemRef} index={this.indexRef}></Elem>
          {endAnchor}
        </>
      );
      const { remove } = render(Body).after(elem);
      this.$remove = remove;
      this.endAnchor = endAnchor;
      return endAnchor;
    };
    return { after };
  }
}
