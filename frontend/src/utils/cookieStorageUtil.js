import Cookies from 'js-cookie';


export const saveTokens = (accessToken, refreshToken, type) => {
  Cookies.set('token', accessToken, { expires: 7 }); 
  Cookies.set('refresh_token', refreshToken, { expires: 7 });
  if (type) {
    Cookies.set('type', type, { expires: 7 });
  }
};

export const clearTokens = () => {
  Cookies.remove('token');
  Cookies.remove('refresh_token');
  Cookies.remove('type');
};

export const isLoggedIn = () => !!Cookies.get('token');
