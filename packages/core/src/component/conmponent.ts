type TData = Record<string, unknown | undefined>;

export class Component<TProps extends TData> {
  id?: string;

  name?: string;

  constructor(protected props?: TProps) {}
}
