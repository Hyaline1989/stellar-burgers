import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ProfileMenu } from '@components';
import styles from './profile-layout.module.css';

export const ProfileLayout: FC = () => (
  <main className={styles.main}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={styles.content}>
      <Outlet />
    </div>
  </main>
);
