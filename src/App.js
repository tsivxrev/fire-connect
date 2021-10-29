import { React, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Icon28Profile, Icon28SettingsOutline } from '@vkontakte/icons';
import {
  AppRoot, SplitLayout, SplitCol, Panel, PanelHeader,
  useAdaptivity, usePlatform, ViewWidth, VKCOM, Group,
  Cell, Tabbar, TabbarItem, Epic, View,
} from '@vkontakte/vkui';

import './App.css';
import api from './api';
import useStore from './hooks/useStore';

import Loading from './panels/Loading';
import Home from './panels/Home';
import Login from './panels/Login';
import Settings from './panels/Settings';

const App = () => {
  const { viewWidth } = useAdaptivity();
  const platform = usePlatform();
  const store = useStore();

  // const isMobile = viewWidth <= ViewWidth.MOBILE;
  const isDesktop = viewWidth >= ViewWidth.TABLET;
  const hasHeader = platform !== VKCOM;

  // const modals = {};

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        store.go({ activeStory: 'login' });
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      try {
        const { data } = await api('/me/');

        store.setUser(data);
        store.go({ activeStory: 'home' });
      } catch (err) {
        store.setModal({ message: 'Опа! Ошибочка' });
      }
    };

    fetchUser();
  }, []);

  return (
    <AppRoot>
      <SplitLayout
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
                  disabled={store.nav.activeStory === 'settings'}
                  style={store.nav.activeStory === 'settings' ? {
                    backgroundColor: 'var(--button_secondary_background)',
                    borderRadius: 8,
                  } : {}}
                  data-story="settings"
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
            tabbar={!isDesktop
              && (
              <Tabbar>
                {store.ready
                && (
                <>
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
                    selected={store.nav.activeStory === 'settings'}
                    data-story="settings"
                    text="Настройки"
                  >
                    <Icon28SettingsOutline />
                  </TabbarItem>
                </>
                )}
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
            <View id="settings" activePanel="settings">
              <Settings id="settings" />
            </View>
          </Epic>
        </SplitCol>
        {store.nav.snackbar}
      </SplitLayout>
    </AppRoot>
  );
};

export default observer(App);
