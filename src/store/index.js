import { React } from 'react';
import { makeAutoObservable } from 'mobx';
import { Snackbar } from '@vkontakte/vkui';

import api from '../api';

export default class Store {
  nav = {
    activeStory: 'loading',
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
  }

  get ready() {
    return Object.keys(this.user).length !== 0;
  }

  go = (to) => {
    Object.assign(this.nav, to);
  }

  setSnackbar = (params) => {
    if (this.nav.snackbar || !params) return;

    const { icon, message } = params;
    this.nav.snackbar = (
      <Snackbar
        before={icon || null}
        onClose={() => this.setSnackbar(null)}
      >
        {message}
      </Snackbar>
    );
  };

  onStoryChange = (e) => { this.nav.activeStory = e.currentTarget.dataset.story; };

  setUser = (user) => {
    this.user = user;
  }
}
