import { React } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, CellButton,
} from '@vkontakte/vkui';

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
      store.setModal({ message: 'Опа! Ошибочка' });
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Настройки</PanelHeader>
      <Group>
        <CellButton onClick={() => { logout(); }} mode="danger">Выйти из аккаунта</CellButton>
      </Group>
    </Panel>
  );
};

export default observer(Settings);
