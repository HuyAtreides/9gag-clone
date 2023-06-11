import { Viewer } from '@toast-ui/react-editor';
import styles from './WYSIWYGView.module.scss';

interface Props {
  readonly content: string | null;
}

const WYSIWYGView: React.FC<Props> = ({ content }) => {
  return (
    <div className={styles.markdownViewContainer}>
      <Viewer initialValue={content || ''} theme='dark' />
    </div>
  );
};

export default WYSIWYGView;
