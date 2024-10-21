const storagePrefix = "attendance_";

const storage = {
  getAccessToken: () => {
    const token = window.localStorage.getItem(`${storagePrefix}access_token`);
    return token === "undefined" ? null : JSON.parse(token as string);
  },
  setAccessToken: (token: string) => {
    window.localStorage.setItem(
      `${storagePrefix}access_token`,
      JSON.stringify(token)
    );
  },
  getRefreshToken: () => {
    const token = window.localStorage.getItem(`${storagePrefix}refresh_token`);
    return token === "undefined" ? null : JSON.parse(token as string);
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
