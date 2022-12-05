import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SenderMessage = ({message}) => {
  return (
    <View className='px-5 py-3 mx-3 my-2 bg-purple-600 rounded-lg rounded-tr-none '
    style={{
        alignSelf: 'flex-start',
        marginLeft: 'auto',
    }}>
      <Text className='text-white'>{message.message}</Text>
    </View>
  )
}

export default SenderMessage

const styles = StyleSheet.create({})