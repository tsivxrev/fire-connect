import { React } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Group, Div, Progress, Card, Caption, Title,
  Panel, PanelHeader, CardGrid, MiniInfoCell,
} from '@vkontakte/vkui';

import {
  Icon20PhoneOutline, Icon24MailOutline,
  Icon20CalendarOutline,
} from '@vkontakte/icons';

import useStore from '../hooks/useStore';

const Home = (id) => {
  const store = useStore();
  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      <Group>
        <Div style={{ marginBottom: 4 }}>
          <Title level="1" weight="medium">
            Привет,
            {' '}
            {store.user.first_name}
            !
          </Title>
        </Div>
        <CardGrid size="m">
          <Card>
            <Div>
              <Caption level="3" weight="medium" style={{ marginBottom: 4 }}>БАЛАНС</Caption>
              <Title level="1" weight="bold">
                {+store.user.active_account.account_amount}
                {' '}
                ₽
              </Title>
            </Div>
          </Card>
          <Card>
            <Div>
              <Caption level="3" weight="medium" style={{ marginBottom: 4 }}>УРОВЕНЬ</Caption>
              <Title level="1" weight="bold">
                {store.user.active_account.level}
              </Title>
            </Div>
          </Card>
          <Card>
            <Div>
              <Caption level="3" weight="medium" style={{ marginBottom: 4 }}>СКИДКА</Caption>
              <Title level="1" weight="bold">
                {+store.user.active_account.level}
                {' '}
                %
              </Title>
            </Div>
          </Card>
          <Card>
            <Div>
              <Caption level="3" weight="medium" style={{ marginBottom: 4 }}>ПЕРСОНАЛЬНАЯ СКИДКА</Caption>
              <Title level="1" weight="bold">
                {+store.user.active_account.discount}
                {' '}
                %
              </Title>
            </Div>
          </Card>
        </CardGrid>
        <CardGrid style={{ marginTop: 8, marginBottom: 16 }} size="l">
          <Card>
            <Div>
              <Caption level="3" weight="medium" style={{ marginBottom: 8 }}>ДО СЛЕДУЮЩЕГО УРОВНЯ</Caption>
              <Progress
                style={{ height: 10, borderRadius: 10 }}
                value={(+store.user.active_account.experience) / 100}
              />
            </Div>
          </Card>
        </CardGrid>
        <MiniInfoCell
          before={<Icon20CalendarOutline />}
        >
          {store.user.birthdate || 'Дата рождения не установлена'}
        </MiniInfoCell>
        <MiniInfoCell
          before={<Icon24MailOutline width={20} height={20} />}
        >
          {store.user.email || 'Почта не привязана'}
        </MiniInfoCell>

        <MiniInfoCell
          before={<Icon20PhoneOutline />}
        >
          {store.user.login}
        </MiniInfoCell>
      </Group>
    </Panel>
  );
};

export default observer(Home);
