import { defineComponent, h, useDynamic, fragment } from '@rexar/core';

export const DynamicExample = defineComponent(() => {
  const [DynamicContent, setContent] = useDynamic(() => <>Initial Content</>);
  const displayRenderFunc = () => {
    setContent(() => <>Custom content</>);
  };
  const Content = defineComponent(() => <>Content from component</>);
  const displayComponent = () => {
    setContent(Content);
  };
  return (
    <>
      <DynamicContent />
      <button onClick={displayRenderFunc}>Display Content</button>
      <button onClick={displayComponent}>Display Component</button>
    </>
  );
});
