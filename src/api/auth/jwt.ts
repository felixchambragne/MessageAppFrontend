import * as Keychain from 'react-native-keychain';

export async function storeToken(token: string | null) {
  try {
    if (token === null) {
      await Keychain.resetGenericPassword();
      return;
    }
    await Keychain.setGenericPassword('token', token);
  } catch (error) {
    console.error('Erreur de stockage du token :', error);
  }
}

export async function retrieveToken() {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Erreur de récupération du token :', error);
    return null;
  }
}
