import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ModalOverlayUI } from '../modal-overlay';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import styles from './modal.module.css';

interface ModalUIProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const modalRoot = document.getElementById('modals');

export const ModalUI: FC<ModalUIProps> = memo(
  ({ title, onClose, children }) => {
    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        e.key === 'Escape' && onClose();
      };

      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }, [onClose]);

    return ReactDOM.createPortal(
      <div data-testid='modal'>
        <ModalOverlayUI onClick={onClose} />
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              data-testid='modal-close'
            >
              <CloseIcon type='primary' />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>,
      modalRoot as HTMLDivElement
    );
  }
);
