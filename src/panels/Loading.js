import { React, useState, useEffect } from 'react';
import {
  Panel, PanelHeader, PanelSpinner, Text, Group, SimpleCell, Div, CardGrid, Card,
} from '@vkontakte/vkui';

import { Icon28RefreshOutline } from '@vkontakte/icons';

const Loading = (id) => {
  const [isProblem, setIsProblem] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsProblem(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      <PanelSpinner />
      {isProblem && (
      <Group>
        <CardGrid size="l">
          <Card style={{ padding: 5 }}>
            <Div>
              <Text>Кажется, что-то пошло не так. Ну что, Миша?</Text>
            </Div>
            <SimpleCell
              onClick={() => { window.location.reload(); }}
              before={<Icon28RefreshOutline />}
            >
              Давай по новой!
            </SimpleCell>
          </Card>
        </CardGrid>
      </Group>
      )}
    </Panel>
  );
};

export default Loading;
