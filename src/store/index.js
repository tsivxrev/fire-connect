import { React } from 'react';
import { makeAutoObservable } from 'mobx';
import { Snackbar } from '@vkontakte/vkui';

import api from '../api';

export default class Store {
  nav = {
    activeStory: 'loading',
    activePanel: null,
    snackbar: null,
    activeModal: null,
    modalProps: {},
  }

  user = {}

  constructor() {
    makeAutoObservable(this);

    api.interceptors.response.use((response) => response, (error) => {
      if (error.response.status === 401) {
        this.go({ activeStory: 'login' });
      }

      return Promise.reject(error);
    });

    window.store = this;
  }

  get ready() {
    return Object.keys(this.user).length !== 0;
  }

  go = (to) => {
    Object.assign(this.nav, to);
  }

  setSnackbar = (snackbar) => {
    this.nav.snackbar = snackbar;
  }

  showSnackbar = (params) => {
    if (this.nav.snackbar || !params) return;
    const { icon, message } = params;

    this.setSnackbar(
      <Snackbar
        before={icon || null}
        onClose={() => this.setSnackbar(null)}
      >
        {message}
      </Snackbar>,
    );
  };

  onStoryChange = (e) => {
    const { story, panel } = e.currentTarget.dataset;
    this.go({
      activeStory: story,
      activePanel: panel || this.nav.activePanel,
    });
  };

  setUser = (user) => {
    this.user = user;
  }
}
