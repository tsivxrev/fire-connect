import { React } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Panel, PanelHeader, Group, SimpleCell, Gallery, Title, Div,
} from '@vkontakte/vkui';

import { Icon28GameOutline, Icon28MoneyCircleOutline } from '@vkontakte/icons';

import useStore from '../hooks/useStore';

const Club = (id) => {
  const store = useStore();

  return (
    <Panel id={id}>
      <PanelHeader>FIRE!</PanelHeader>
      <Group>
        <Gallery
          slideWidth="90%"
          style={{ height: 200, marginBottom: 8 }}
          bullets="light"
          showArrows
        >
          {store.gallery.map((url) => (
            <div
              key={url}
              style={{
                background: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </Gallery>
        <Div>
          <Title level="3">
            Твой клуб — твои люди. Чувствуй себя как дома в компьютерном клубе FIRE!
          </Title>
        </Div>
        <SimpleCell
          onClick={() => { store.go({ activePanel: 'pricelist' }); }}
          expandable
          before={<Icon28MoneyCircleOutline />}
        >
          Прайс-лист
        </SimpleCell>
        <SimpleCell
          onClick={() => { store.go({ activePanel: 'games' }); }}
          expandable
          before={<Icon28GameOutline />}
        >
          Список игр
        </SimpleCell>
      </Group>
    </Panel>
  );
};

export default observer(Club);
