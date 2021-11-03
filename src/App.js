import { React, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Icon28Profile, Icon28SettingsOutline, Icon56MailOutline, Icon28TvOutline,
} from '@vkontakte/icons';
import {
  AppRoot, SplitLayout, SplitCol, Panel, PanelHeader,
  useAdaptivity, usePlatform, ViewWidth, VKCOM, Group,
  Cell, Tabbar, TabbarItem, Epic, View, ModalRoot, ModalCard,
  Button, FormLayout, FormItem, Input,
} from '@vkontakte/vkui';

import './App.css';
import useStore from './hooks/useStore';

import Loading from './panels/Loading';
import Login from './panels/Login';

import Home from './panels/Home';
import Club from './panels/Club';
import GamesList from './panels/Content';

import Settings from './panels/Settings';
import ChangePassword from './panels/ChangePassword';
import EditProfile from './panels/EditProfile';
import Pricelist from './panels/Pricelist';

const App = () => {
  const { viewWidth } = useAdaptivity();
  const platform = usePlatform();
  const store = useStore();

  const isDesktop = viewWidth >= ViewWidth.TABLET;
  const hasHeader = platform !== VKCOM;

  const modal = (
    <ModalRoot activeModal={store.nav.activeModal}>
      <ModalCard
        id="emailConfirmation"
        onClose={() => store.setModal(null)}
        actions={(
          <Button
            loading={store.nav.modalProps.emailConfirmation.isLoading}
            disabled={!store.nav.modalProps.emailConfirmation.canSubmit}
            onClick={() => store.confirmEmail()}
            size="l"
            mode="commerce"
          >
            Подтвердить
          </Button>
        )}
        icon={<Icon56MailOutline />}
        header="Проверь почту"
        subheader="Найди письмо от Enestech с кодом подтверждения и введи его ниже"
      >
        <FormLayout>
          <FormItem
            style={{ paddingTop: 10, paddingBottom: 5 }}
            top="Код подтверждения"
            status={store.nav.modalProps.emailConfirmation.isError ? 'error' : 'default'}
            bottom={
              store.nav.modalProps.emailConfirmation.isError
              && store.nav.modalProps.emailConfirmation.errorMessage
            }
          >
            <Input
              type="text"
              name="code"
              placeholder="jQ7aLW"
              onChange={store.emailConfirmationOnChange}
            />
          </FormItem>
        </FormLayout>
      </ModalCard>
    </ModalRoot>
  );

  useEffect(() => {
    store.fetchUser();
  }, []);

  return (
    <AppRoot>
      <SplitLayout
        modal={modal}
        header={hasHeader && <PanelHeader separator={false} />}
        style={{ justifyContent: 'center' }}
      >
        {(isDesktop && store.ready) && (
          <SplitCol fixed width="280px" maxWidth="280px">
            <Panel>
              {hasHeader && <PanelHeader />}
              <Group mode="plain">
                <Cell
                  disabled={store.nav.activeStory === 'home'}
                  style={store.nav.activeStory === 'home' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="home"
                  onClick={store.onStoryChange}
                  before={<Icon28Profile />}
                >
                  Профиль
                </Cell>
                <Cell
                  disabled={store.nav.activeStory === 'club'}
                  style={store.nav.activeStory === 'club' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="club"
                  data-panel="club"
                  onClick={store.onStoryChange}
                  before={<Icon28TvOutline />}
                >
                  Клуб
                </Cell>
                <Cell
                  disabled={store.nav.activeStory === 'settings'}
                  style={store.nav.activeStory === 'settings' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="settings"
                  data-panel="settings"
                  onClick={store.onStoryChange}
                  before={<Icon28SettingsOutline />}
                >
                  Настройки
                </Cell>
              </Group>
            </Panel>
          </SplitCol>
        )}

        <SplitCol
          animate={!isDesktop}
          spaced={isDesktop}
          width={isDesktop ? '560px' : '100%'}
          maxWidth={isDesktop ? '560px' : '100%'}
        >
          <Epic
            activeStory={store.nav.activeStory}
            tabbar={(!isDesktop && store.ready)
              && (
              <Tabbar>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'home'}
                  data-story="home"
                  text="Профиль"
                >
                  <Icon28Profile />
                </TabbarItem>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'club'}
                  data-panel="club"
                  data-story="club"
                  text="Клуб"
                >
                  <Icon28TvOutline />
                </TabbarItem>
                <TabbarItem
                  onClick={store.onStoryChange}
                  selected={store.nav.activeStory === 'settings'}
                  data-panel="settings"
                  data-story="settings"
                  text="Настройки"
                >
                  <Icon28SettingsOutline />
                </TabbarItem>
              </Tabbar>
              )}
          >

            <View id="loading" activePanel="loading">
              <Loading id="loading" />
            </View>
            <View id="login" activePanel="login">
              <Login id="login" />
            </View>

            <View id="home" activePanel="home">
              <Home id="home" />
            </View>

            <View id="club" activePanel={store.nav.activePanel}>
              <Club id="club" />
              <Pricelist id="pricelist" />
              <GamesList id="games" />
            </View>

            <View id="settings" activePanel={store.nav.activePanel}>
              <Settings id="settings" />
              <ChangePassword id="changePassword" />
              <EditProfile id="editProfile" />
            </View>
          </Epic>
        </SplitCol>
        {store.nav.snackbar}
      </SplitLayout>
    </AppRoot>
  );
};

export default observer(App);
