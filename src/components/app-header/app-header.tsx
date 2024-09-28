import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { UserNameSelector } from '../../slice/profileUserSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useSelector(UserNameSelector);

  return <AppHeaderUI userName={userName ? userName : 'Личный кабинет'} />;
};
