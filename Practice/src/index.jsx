import { View, Text, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function () {

    const [name, setName] = useState('Hello');
    const [background, setBackground] = useState();

    const handleChangeName = () => {
        if (name === 'Hello') {
            setName('Xin chao');
        } else {
            setName('Hello')
        }
    }

    const handleChangeColor = (color) => {
        switch (color) {
            case 'yellow':
                setBackground('#F7F2B8')
                break;
            case 'orange':
                setBackground('#FFD580');
                break;
            case 'blue':
                setBackground('#ADD8E6');
                break;
            case 'green':
                setBackground('#B7E4C7');
                break;
            default:
                setBackground('white');
        }
    }
    return (
        <View style={{
            margin: 50,
            backgroundColor: background
        }}>
            <View>
                <Text style={{ marginBottom: 5 }}>Bài 1</Text>
                <Text>{name}</Text>
                <Button
                    onPress={handleChangeName}
                    title='Đổi tên'
                > </Button>
            </View>

            <View>
                <Text style={{ marginBottom: 5 }}>Bài 2</Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <TouchableOpacity onPress={() => handleChangeColor('yellow')}>
                        <Text>🟡</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChangeColor('orange')}>
                        <Text>🟠</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChangeColor('blue')}>
                        <Text>🔵</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChangeColor('green')}>
                        <Text>🟢</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}