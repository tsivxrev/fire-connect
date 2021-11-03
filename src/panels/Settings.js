import { React } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, CellButton, SimpleCell, Banner, Avatar,
  Button,
} from '@vkontakte/vkui';

import { Icon28KeyOutline, Icon28Profile } from '@vkontakte/icons';

import useStore from '../hooks/useStore';

const Settings = (id) => {
  const store = useStore();

  return (
    <Panel id={id}>
      <PanelHeader>Настройки</PanelHeader>
      <Group>
        {store.emailConfirmation.needed && (
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
              {store.emailConfirmation.email}
              <br />
              Необходимо ввести код подтверждения чтобы использовать новый адрес почты
            </>
        )}
          actions={(
            <div style={{ marginTop: 10, marginBottom: 8 }}>
              <Button onClick={() => { store.setModal('emailConfirmation'); }} hasHover={false}>Погнали!</Button>
              <Button mode="tertiary" onClick={() => { store.setEmailConfirmationStatus({}); }} hasHover={false}>Уже не хочу</Button>
            </div>
        )}
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
        <CellButton onClick={() => { store.logout(); }} mode="danger">Выйти из аккаунта</CellButton>
      </Group>
    </Panel>
  );
};

export default observer(Settings);
