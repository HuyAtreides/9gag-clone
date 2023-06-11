import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef } from 'react';

interface Props {
  readonly onChange?: (value: string) => void;
  readonly height?: string;
}

const WYSIWYGEditor: React.FC<Props> = ({ onChange, height = '50vh' }) => {
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    const editor = editorRef.current;

    if (editor) {
      editor.getInstance().setHTML('');
    }
  }, []);

  const contentChanged = () => {
    const editor = editorRef.current;

    if (onChange) {
      onChange(editor?.getInstance()?.getMarkdown() || '');
    }
  };

  return (
    <Editor
      height={height}
      ref={editorRef}
      theme='dark'
      hideModeSwitch
      initialEditType='wysiwyg'
      onKeyup={contentChanged}
      useCommandShortcut
      usageStatistics={false}
    />
  );
};

export default WYSIWYGEditor;
