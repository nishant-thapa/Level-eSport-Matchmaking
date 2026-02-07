// src/service/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { API } from '../api/client';
import { endpoints } from '../api/endpoints';

export const googleSignupUser = async (payload) => {
  try {
    const response = await API.post(endpoints.googleSignup, payload);
    const { tokens, user } = response.data;

    await AsyncStorage.multiSet([
      ['@access_token', tokens.access],
      ['@refresh_token', tokens.refresh],
      ['@user', JSON.stringify(user)]
    ]);

    return user;
  } catch (error) {
    Toast.show(error.message);
  }
};

export const appleSignupUser = async (payload) => {
  try {
    const response = await API.post(endpoints.appleSignup, payload);
    const { tokens, user } = response.data;

    await AsyncStorage.multiSet([
      ['@access_token', tokens.access],
      ['@refresh_token', tokens.refresh],
      ['@user', JSON.stringify(user)]
    ]);
    return user;
  } catch (error) {
    Toast.show(error?.response?.data?.message || error.message || 'Apple Sign-In failed.');
  }
};

export const getStoredUser = async () => {
  const token = await AsyncStorage.getItem('@access_token');
  const user = await AsyncStorage.getItem('@user');
  return token && user ? JSON.parse(user) : null;
};

export const updateUser = async (payload) => {
  try {
    const response = await API.put(endpoints.updateUser, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const { user } = response.data;
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    return user;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      Toast.show(error.response.data.message);
    } else {
      Toast.show('Profile update failed. Please try again.');
    }
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await API.get(endpoints.getUser);
    const { user } = response.data;
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    return user;
  } catch (error) {
    if (__DEV__) console.log(error);
  }
};