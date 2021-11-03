import { React } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, CellButton, SimpleCell, Banner, Avatar,
  Button,
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
        {store.user.emailConfirmation.needed && (
        <Banner
          before={(
            <Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}>
              <span style={{ color: '#fff' }}>!</span>
            </Avatar>
        )}
          header="Email ожидает подтверждения"
          subheader={(
            <>
              Ты менял адрес почты на
              {' '}
              {store.user.emailConfirmation.email}
              <br />
              Необходимо ввести код подтверждения чтобы использовать новый адрес почты
            </>
        )}
          actions={<Button mode="tertiary" onClick={() => { store.setModal('emailConfirmation'); }} hasHover={false}>Погнали!</Button>}
        />
        )}
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
