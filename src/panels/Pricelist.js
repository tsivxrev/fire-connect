import { React } from 'react';
import { observer } from 'mobx-react-lite';

import {
  Panel, PanelHeader, Placeholder, PanelHeaderBack,
} from '@vkontakte/vkui';
import { Icon56SettingsOutline } from '@vkontakte/icons';

import useStore from '../hooks/useStore';

const Pricelist = (id) => {
  const store = useStore();

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => { store.go({ activePanel: 'club' }); }} />}>Прайс-лист</PanelHeader>
      <Placeholder
        icon={<Icon56SettingsOutline />}
        header="Раздел в разработке"
      >
        Не хотим показывать настолько низкие цены
      </Placeholder>
    </Panel>
  );
};
export default observer(Pricelist);
