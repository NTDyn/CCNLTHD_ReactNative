import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { getData, storeData } from '../../utils/services'
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/SupabaseConfig';
import Home from '../home';

export default function index() {

  const router = useRouter();

  useEffect(() => {
    checkUserAuth();

  }, [])

  const checkUserAuth = async () => {
    const isLogin = await getData("login");
    if (isLogin !== 'true') {
      router.replace("../login");
    }
  }


  return (
    <Home></Home>
  )

}