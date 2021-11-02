import { React, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Group, FormLayout, FormItem, Input, Text, Footer,
  Panel, PanelHeader, Button, Div, Title, Subhead, IconButton,
} from '@vkontakte/vkui';

import {
  Icon12EyeSlashOutline, Icon16ErrorCircleFill,
} from '@vkontakte/icons';

import useStore from '../hooks/useStore';
import api from '../api';

const Login = (id) => {
  const store = useStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [canLogin, setCanLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onChange = (e) => {
    const { name, value } = e.currentTarget;
    setCredentials(Object.assign(credentials, { [name]: value }));

    setCanLogin(credentials.login.length && credentials.password.length);
  };

  const login = async () => {
    setIsLoading(true);
    try {
      const { data } = await api('/login/', {
        method: 'POST',
        data: {
          login: credentials.login,
          password: credentials.password,
        },
      });

      setIsLoading(false);

      api.defaults.headers.common.Authorization = `Bearer ${data.token.token}`;
      localStorage.setItem('token', data.token.token);
      store.setUser(data.user);
      store.go({ activeStory: 'home' });
    } catch (err) {
      store.showSnackbar({
        icon: <Icon16ErrorCircleFill width={20} height={20} />,
        message: err.response?.data?.detail ? err.response.data.detail : 'Произошла ошибка',
      });
      setIsLoading(false);
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Авторизация</PanelHeader>
      <Group>
        <Div>
          <Title style={{ marginBottom: 16 }} level="2" weight="medium">
            FIRE! Connect
          </Title>
          <Text weight="regular" style={{ marginBottom: 9 }}>
            Твой профиль в компьютерном клубе FIRE! Тут ты можешь сделать буквально все.
            Пока что приложение в разработке, если есть какие-то вопросы или предложения - пиши
            в личку @nitroauth
          </Text>
          <Subhead weight="regular" style={{ color: 'var(--text_secondary)' }}>
            Для продолжения введи данные от аккаунта в клубе
          </Subhead>
        </Div>
        <FormLayout onSubmit={(e) => { e.preventDefault(); login(); }}>
          <FormItem
            style={{ paddingTop: 5, paddingBottom: 5 }}
            top="Логин"
          >
            <Input
              type="phone"
              name="login"
              placeholder="+7"
              onChange={onChange}
            />
          </FormItem>
          <FormItem
            style={{ paddingTop: 5, paddingBottom: 5 }}
            top="Пароль"
          >
            <Input
              after={(
                <IconButton
                  onClick={togglePasswordVisibility}
                >
                  <Icon12EyeSlashOutline fill={passwordVisible && 'white'} width={16} height={16} />
                </IconButton>
              )}
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              onChange={onChange}
            />
          </FormItem>
          <FormItem>
            <Button
              type="submit"
              disabled={!canLogin}
              loading={isLoading}
              stretched
              size="l"
              mode="commerce"
            >
              Полетели!
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
      <Footer>FIRE! Connect Open Beta v1</Footer>
    </Panel>
  );
};

export default observer(Login);
