import { React } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, CellButton, SimpleCell,
} from '@vkontakte/vkui';

import { Icon28KeyOutline, Icon28Profile } from '@vkontakte/icons';

import useStore from '../hooks/useStore';
import api from '../api';

const Settings = (id) => {
  const store = useStore();

  const logout = async () => {
    try {
      await api('/logout/', { method: 'POST' });

      store.setUser({});
      localStorage.removeItem('token');
      store.go({ activeStory: 'login' });
    } catch (err) {
      store.showSnackbar({ message: 'Произошла ошибка' });
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Настройки</PanelHeader>
      <Group>
        <SimpleCell
          onClick={() => { store.go({ activePanel: 'editProfile' }); }}
          expandable
          before={<Icon28Profile />}
        >
          Редактировать профиль
        </SimpleCell>
        <SimpleCell
          onClick={() => { store.go({ activePanel: 'changePassword' }); }}
          expandable
          before={<Icon28KeyOutline />}
        >
          Сменить пароль
        </SimpleCell>
        <CellButton onClick={() => { logout(); }} mode="danger">Выйти из аккаунта</CellButton>
      </Group>
    </Panel>
  );
};

export default observer(Settings);
