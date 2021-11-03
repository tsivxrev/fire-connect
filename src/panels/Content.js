import { React } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Panel, PanelHeader, Placeholder, PanelHeaderBack,
} from '@vkontakte/vkui';
import { Icon56SettingsOutline } from '@vkontakte/icons';

import useStore from '../hooks/useStore';

const GamesList = (id) => {
  const store = useStore();

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => { store.go({ activePanel: 'club' }); }} />}>Список игр</PanelHeader>
      <Placeholder
        icon={<Icon56SettingsOutline />}
        header="Раздел в разработке"
      >
        Скоро тут появятся самые мощные тайтлы, которые есть у нас в клубе
      </Placeholder>
    </Panel>
  );
};
export default observer(GamesList);
