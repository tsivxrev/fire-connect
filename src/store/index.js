import { React } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { Snackbar } from '@vkontakte/vkui';

import { Icon20Info } from '@vkontakte/icons';

import api from '../api';

export default class Store {
  nav = {
    activeStory: 'loading',
    activePanel: null,
    snackbar: null,
    activeModal: null,
    modalProps: {
      emailConfirmation: {
        code: null,
        canSubmit: false,
        isLoading: false,
        isError: false,
        errorMessage: 'Произошла ошибка',
      },
    },
  }

  user = {
    emailConfirmation: {
      needed: false,
      email: null,
    },
  }

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

  setModal = (id) => {
    this.nav.activeModal = id;
  }

  setSnackbar = (snackbar) => {
    this.nav.snackbar = snackbar;
  }

  showSnackbar = (params) => {
    if (this.nav.snackbar || !params) return;
    const {
      icon, message, action, duration,
    } = params;

    this.setSnackbar(
      <Snackbar
        duration={duration || 2000}
        action={action?.text || null}
        onActionClick={action?.handler || null}
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
      activePanel: this.nav.activePanel || panel,
    });
  };

  setUser = (user) => {
    Object.assign(this.user, user);
  }

  setEmailConfirmationStatus = ({ email, needed }) => {
    Object.assign(this.user.emailConfirmation, { email, needed });
    localStorage.setItem('emailConfirmationStatus', JSON.stringify({ email, needed }));
  }

  emailConfirmationOnChange = (e) => {
    const { value } = e.currentTarget;
    Object.assign(this.nav.modalProps.emailConfirmation, {
      code: value,
      canSubmit: value.length >= 6,
    });
  }

  confirmEmail = async () => {
    runInAction(() => {
      this.nav.modalProps.emailConfirmation.isLoading = true;
    });

    try {
      await api('/me/email/confirm/', {
        method: 'POST',
        data: {
          code: this.nav.modalProps.emailConfirmation.code,
        },
      });

      this.setModal(null);
      this.setEmailConfirmationStatus({ email: null, needed: false });
      this.showSnackbar({
        icon: <Icon20Info />,
        message: 'Почта подтверждена!',
      });
    } catch (err) {
      Object.assign(this.nav.modalProps.emailConfirmation, {
        isError: true,
        isLoading: false,
        errorMessage: err.response?.data?.detail || 'Неизвестная ошибка',
      });
    }
  };

  fetchUser = async () => {
    const token = localStorage.getItem('token');
    let emailConfirmationStatus = localStorage.getItem('emailConfirmationStatus');

    if (!token) {
      this.go({ activeStory: 'login' });
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const { data } = await api('/me/');

      this.setUser(data);
      this.go({ activeStory: 'home' });

      if (emailConfirmationStatus) {
        emailConfirmationStatus = JSON.parse(emailConfirmationStatus);
        if (emailConfirmationStatus.needed
          && emailConfirmationStatus.email === this.user.email) return;

        Object.assign(this.user.emailConfirmation, emailConfirmationStatus);
      }
    } catch (err) {
      this.showSnackbar({ message: 'Произошла ошибка' });
    }
  };
}
