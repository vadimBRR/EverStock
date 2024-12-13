import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import Loading from '@/src/components/Loading'
import CustomButton from '@/src/components/CustomButton'
import { useQueryClient } from '@tanstack/react-query'

export default function AccountScreen() {
  const [email, setEmail] = React.useState('')
	// const { data, isLoading } = useGetUserById()
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [user, setUser] = React.useState<{firstName: string, lastName: string}>({firstName: '', lastName: ''})
  const updateUserInfo = () => {
    
  }
  // const {actor} = useAuth()
// console.log(user);
  useEffect(() => {
    if(user){
      setFirstName(user?.firstName || '')
      setLastName(user?.lastName || '')
    }
  },[user])

  const handleUpdateProfile = async () => {


    if(firstName && firstName !== user?.firstName ){
      // await updateUserInfo!({full_name: fullName}).then(() => {
      //   const client = useQueryClient();
      //   client.invalidateQueries({queryKey: ['user']});
      // })
      // try {
      //   const res = await user?.update({firstName, lastName})
      //   console.log("res");
      //   console.log(res);
      // } catch (error) {
      //   console.log(error);
      // }

      setUser({...user, firstName})

    }
  }
  
  // if(isLoading) return <Loading/>

  
  return (
    <Container isPadding={false}>
        <Stack.Screen options={{title:'Account', headerTitleAlign:'center'}}/>
        <View className='flex-col justify-between flex-1 mb-6'>
          <View>
            <CustomInput label='First name' name={firstName} setName={setFirstName} containerStyle='mb-2'/>
            <CustomInput label='Last name' name={lastName} setName={setLastName} containerStyle='mb-2'/>
            {/* <CustomInput label='Email' name={email} setName={setEmail} /> */}
          </View>
          <CustomButton text='Apply' disabled={firstName.trim() === user?.firstName?.trim() && lastName.trim() === user?.lastName?.trim()  } onClick={handleUpdateProfile}/>
        </View>
    </Container>
  )
}