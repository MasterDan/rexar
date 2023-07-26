import { AnyComponent } from '../@types/any-component';

export type ComponentTransformerFunc = (c: AnyComponent) => AnyComponent;

export class ElementTransformer {
  private body: ComponentTransformerFunc[] = [];

  public transformationResult: AnyComponent | undefined;

  public isTrasformationDone = false;

  append(fn: ComponentTransformerFunc) {
    this.body.push(fn);
  }

  get isEmpty() {
    return this.body.length === 0;
  }

  apply(c: AnyComponent) {
    if (this.isEmpty) {
      throw new Error('Cannot apply non existing transformers');
    }
    if (this.isTrasformationDone) {
      throw new Error('Transformation has already been applied');
    }
    this.transformationResult = this.body.reduce<AnyComponent>(
      (component, transformer) => transformer(component),
      c,
    );
    if (this.transformationResult != null) {
      this.isTrasformationDone = true;
    }
  }
}
