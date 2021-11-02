import { React, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Group, FormLayout, FormItem, Input,
  Panel, PanelHeader, Button, IconButton,
} from '@vkontakte/vkui';

import {
  Icon12EyeSlashOutline, Icon16ErrorCircleFill, Icon20Info,
} from '@vkontakte/icons';

import useStore from '../hooks/useStore';
import api from '../api';

const ChangePassword = (id) => {
  const store = useStore();
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [canChange, setCanChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const onChange = (e) => {
    const { name, value } = e.currentTarget;
    setCredentials(Object.assign(credentials, { [name]: value }));

    setCanChange(credentials.currentPassword.length && credentials.newPassword.length);
  };

  const login = async () => {
    setIsLoading(true);
    try {
      await api('/me/password/', {
        method: 'POST',
        data: {
          current_password: credentials.currentPassword,
          new_password: credentials.newPassword,
        },
      });

      setIsLoading(false);

      store.go({ activePanel: 'settings' });
      store.showSnackbar({
        icon: <Icon20Info />,
        message: 'Крутой пароль, ставим!',
      });
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
      <PanelHeader>Смена пароля</PanelHeader>
      <Group>
        <FormLayout onSubmit={(e) => { e.preventDefault(); login(); }}>
          <FormItem
            style={{ paddingTop: 5, paddingBottom: 5 }}
            top="Текущий пароль"
          >
            <Input
              after={(
                <IconButton
                  onClick={toggleCurrentPasswordVisibility}
                >
                  <Icon12EyeSlashOutline fill={currentPasswordVisible && 'white'} width={16} height={16} />
                </IconButton>
              )}
              type={currentPasswordVisible ? 'text' : 'password'}
              name="currentPassword"
              onChange={onChange}
            />
          </FormItem>
          <FormItem
            style={{ paddingTop: 5, paddingBottom: 5 }}
            top="Новый пароль"
          >
            <Input
              after={(
                <IconButton
                  onClick={toggleNewPasswordVisibility}
                >
                  <Icon12EyeSlashOutline fill={newPasswordVisible && 'white'} width={16} height={16} />
                </IconButton>
              )}
              type={newPasswordVisible ? 'text' : 'password'}
              name="newPassword"
              onChange={onChange}
            />
          </FormItem>
          <FormItem>
            <Button
              type="submit"
              disabled={!canChange}
              loading={isLoading}
              stretched
              size="l"
              mode="commerce"
            >
              Сменить пароль
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  );
};

export default observer(ChangePassword);
