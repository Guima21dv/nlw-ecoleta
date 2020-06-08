import React, { useState, useEffect } from 'react'
import { View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton, TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select'

const Home = () => {
    const [uf, setUf] = useState('')
    const [city, setCity] = useState('')
    const navigation = useNavigation()

    // useEffect(() => {
    //     axios.get<Array<any>>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    //         .then(response => {
    //             setUfs(response.data.map(uf => {
    //                 return {
    //                     nome: uf.nome,
    //                     sigla: uf.sigla
    //                 }
    //             }))
    //         })
    // }, [])

    function handleNavigateToPoint() {
        navigation.navigate('Point',
        {
            uf,
            city
        })
    }
    //     <RNPickerSelect
    //     useNativeAndroidPickerStyle={false}
    //     placeholder="Selecione um Estado"
    //     onValueChange={() => { }}
    //     items={[
    //         { label: 'Selecione um estaddo', value: 0 }
    //     ]}
    // >

    // </RNPickerSelect>
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')}></Image>
                    <View>
                        <Text style={styles.title}>
                            Seu marketplace de coleta de residuos
                        </Text>
                        <Text style={styles.description}>
                            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
                        </Text>
                    </View>

                </View>
                <View style={styles.select}>

                </View>
                <View style={styles.footer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a UF"
                        value={uf}
                        maxLength={2}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        onChangeText={setUf} />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a Cidade"
                        value={city}
                        onChangeText={setCity}
                    />
                    {/* <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        placeholder="Selecione um Estado"
                        onValueChange={() => { }}
                        items={ufs.map(uf => {
                            return {
                                label: uf.nome,
                                value: uf.sigla
                            }
                        })}
                    >

                    </RNPickerSelect> */}
                    <RectButton style={styles.button} onPress={handleNavigateToPoint}>
                        <View style={styles.buttonIcon}>
                            <Icon name="arrow-right" color="#fff"></Icon>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home