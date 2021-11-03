import { React } from 'react';
import { observer } from 'mobx-react-lite';
import humanizeDuration from 'humanize-duration';

import {
  Group, Div, Progress, Card, Caption, Title, Header,
  Panel, PanelHeader, CardGrid, Text,
} from '@vkontakte/vkui';

import useStore from '../hooks/useStore';

const Home = (id) => {
  const store = useStore();

  const zonesList = Object.keys(store.zones).map((key) => (
    <Card key={key}>
      <Div>
        <Caption level="3" weight="medium" style={{ marginBottom: 4 }}>{store.zones[key].name}</Caption>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title style={{ marginRight: 5 }} level="1" weight="bold">
            {store.zones[key].price - (100 * (store.user.active_account.level * 0.01))}
            {' '}
            ₽
          </Title>
          <Text style={{ color: 'var(--text_secondary)', marginRight: 5 }} level="3" weight="regular">/час</Text>
        </div>
        {(+store.user.active_account.account_amount
          > 0 && store.user.active_account.level < 100) && (
          <Text style={{ color: 'var(--text_secondary)', marginBottom: 4 }} level="4" weight="regular">
            У тебя
            {' '}
            {humanizeDuration(((
              store.user.active_account.account_amount
            / (store.zones[key].price - (100 * (store.user.active_account.level * 0.01))))
            * 3600) * 1000,
            {
              language: 'ru',
              round: true,
              delimiter: ' и ',
              units: ['h', 'm'],
            })}
            {' '}
            игры в этой зоне
          </Text>
        )}
      </Div>
    </Card>
  ));

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
        <Group mode="plain" header={<Header mode="secondary">Твой тариф</Header>}>
          <CardGrid size="l">
            {zonesList}
          </CardGrid>
        </Group>
        {/*         <MiniInfoCell
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
        </MiniInfoCell> */}
      </Group>
    </Panel>
  );
};

export default observer(Home);
