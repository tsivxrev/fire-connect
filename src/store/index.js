import { React } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { Snackbar } from '@vkontakte/vkui';

import { Icon20Info } from '@vkontakte/icons';

import { senet, api } from '../api';

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

  user = {}

  emailConfirmation = {
    needed: false,
    email: null,
    userId: null,
  }

  gallery = [
    'https://sun9-41.userapi.com/impg/Oypr4gM2svjQEwUf0qHdTnm1EtpkZIvZYpEYjw/B_w0KosA0Ak.jpg?size=1280x853&quality=96&sign=08c36c524b12366d2713317e217c59b9&type=album',
    'https://sun9-67.userapi.com/impg/GnOpOhkWKHSzZooE0MGp0r-Y2WiNQFRVLnMigg/RYXKfIZ30fQ.jpg?size=1280x853&quality=96&sign=a65ac8229a6e00da6f67f06437b28a15&type=album',
    'https://sun9-72.userapi.com/impg/Z24VVNY7liI6CaygPMO7FrxJ6O1JFZsM9q0zRg/2qqdaydOxxE.jpg?size=1280x853&quality=96&sign=aded2e2fa8fb679fc6bd5c2f154221fc&type=album',
    'https://sun9-31.userapi.com/impg/yoJQaZXJxiFWr_MvG0aZHwrqWuw4C5eEksAtig/VwnXl39UhBM.jpg?size=1280x853&quality=96&sign=5225fb130d73ccbcbfede51dff78c678&type=album',
  ]

  zones = {
    standart: {
      name: 'STANDART ZONE',
      price: 100, // руб/час
    },
    medium: {
      name: 'MEDIUM ZONE',
      price: 110,
    },
    vip: {
      name: 'VIP ZONE',
      price: 120,
    },
  }

  constructor() {
    makeAutoObservable(this);

    senet.interceptors.response.use((response) => response, (error) => {
      if (error.response.status === 401) {
        this.go({ activeStory: 'login' });
      }

      return Promise.reject(error);
    });

    window.store = this;
  }

  get ready() {
    return !!this.user.id;
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
      activePanel: panel,
    });
  };

  setUser = (user) => {
    this.user = user;
  }

  setEmailConfirmationStatus = ({ email, needed, userId }) => {
    this.emailConfirmation = { email, needed, userId };
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
      await senet('/me/email/confirm/', {
        method: 'POST',
        data: {
          code: this.nav.modalProps.emailConfirmation.code,
        },
      });

      this.setModal(null);
      this.setEmailConfirmationStatus({ email: null, needed: false, userId: 0 });
      localStorage.removeItem('emailConfirmationStatus');
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

  logout = async () => {
    try {
      await senet('/logout/', { method: 'POST' });

      this.setUser({});
      this.setEmailConfirmationStatus({});
      localStorage.removeItem('token');
      this.go({ activeStory: 'login' });
    } catch (err) {
      this.showSnackbar({ message: 'Произошла ошибка' });
    }
  }

  fetchUser = async () => {
    const token = localStorage.getItem('token');
    let emailConfirmationStatus = localStorage.getItem('emailConfirmationStatus');

    if (!token) {
      this.go({ activeStory: 'login' });
      return;
    }

    senet.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const { data } = await senet('/me/');

      this.setUser(data);
      this.go({ activeStory: 'home' });

      if (process.env.NODE_ENV === 'production') {
        const search = new URLSearchParams(window.location.search);
        api('/analytics', {
          headers: {
            'x-user-id': search.get('vk_user_id') || 0,
            'x-senet-login': this.user.login,
            'x-action': 'fetchUser',
          },
        }).then(() => {}).catch(() => {});
      }

      if (emailConfirmationStatus) {
        emailConfirmationStatus = JSON.parse(emailConfirmationStatus);
        if (emailConfirmationStatus.userId !== this.user.id) return;
        this.setEmailConfirmationStatus(emailConfirmationStatus);
      }
    } catch (err) {
      this.showSnackbar({ message: 'Произошла ошибка' });
    }
  };
}
