/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */

import { React, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Group, FormLayout, FormItem, Input, DatePicker,
  Panel, PanelHeader, Button, PanelHeaderBack,
} from '@vkontakte/vkui';

import {
  Icon16ErrorCircleFill, Icon20Info,
} from '@vkontakte/icons';

import useStore from '../hooks/useStore';
import api from '../api';

function isValidDate(date) {
  date = new Date(date);
  return date.toString() !== 'Invalid Date';
}

const parseDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
    const day = date.getUTCDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day, month, year };
  }

  let { day, month, year } = date;
  day = String(day).padStart(2, '0');
  month = String(month).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const EditProfile = (id) => {
  const store = useStore();
  const [canChange, setCanChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({
    first_name: store.user.first_name,
    birthdate: store.user.birthdate,
  });

  useEffect(() => {
    setCanChange(info.first_name.length && info.birthdate);
  }, []);

  const onChange = (e) => {
    let name;
    let value;

    if (!e.currentTarget) {
      name = 'birthdate';
      value = parseDate(e);
    } else {
      name = e.currentTarget.name;
      value = e.currentTarget.value;
    }

    setInfo(Object.assign(info, { [name]: value }));
    setCanChange(info.first_name.length && isValidDate(info.birthdate));
  };

  const editProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await api('/me/', {
        method: 'PATCH',
        data: {
          first_name: info.first_name,
          birthdate: info.birthdate,
        },
      });

      setIsLoading(false);

      store.setUser(data);
      store.go({ activePanel: 'settings' });
      store.showSnackbar({
        icon: <Icon20Info />,
        message: 'Информация обновлена',
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
      <PanelHeader left={<PanelHeaderBack onClick={() => { store.go({ activePanel: 'settings' }); }} />}>Профиль</PanelHeader>
      <Group>
        <FormLayout onSubmit={(e) => { e.preventDefault(); editProfile(); }}>
          <FormItem
            style={{ paddingTop: 5, paddingBottom: 5 }}
            top="Имя"
          >
            <Input
              type="text"
              name="first_name"
              defaultValue={info.first_name}
              onChange={onChange}
            />
          </FormItem>
          <FormItem top="Дата рождения">
            <DatePicker
              min={{ day: 1, month: 1, year: 1945 }}
              max={{ day: 1, month: 1, year: (new Date()).getFullYear() }}
              dayPlaceholder="День"
              monthPlaceholder="Месяц"
              yearPlaceholder="Год"
              defaultValue={info.birthdate && parseDate(info.birthdate)}
              name="birthdate"
              onDateChange={onChange}
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
              Сохранить
            </Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  );
};

export default observer(EditProfile);
