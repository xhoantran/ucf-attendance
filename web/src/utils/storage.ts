const storagePrefix = "ucf_here_";

const storage = {
  getAccessToken: () => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}access_token`) as string
    );
  },
  setAccessToken: (token: string) => {
    window.localStorage.setItem(
      `${storagePrefix}access_token`,
      JSON.stringify(token)
    );
  },
  getRefreshToken: () => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}refresh_token`) as string
    );
  },
  setRefreshToken: (token: string) => {
    window.localStorage.setItem(
      `${storagePrefix}refresh_token`,
      JSON.stringify(token)
    );
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}access_token`);
    window.localStorage.removeItem(`${storagePrefix}refresh_token`);
  },
};

export default storage;
