import { React } from 'react';
import {
  Panel, PanelHeader, PanelSpinner,
} from '@vkontakte/vkui';

const Loading = (id) => (
  <Panel id={id}>
    <PanelHeader>Главная</PanelHeader>
    <PanelSpinner />
  </Panel>
);

export default Loading;
