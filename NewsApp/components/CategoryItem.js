import React from "react";
import { TouchableOpacity,Text,StyleSheet } from "react-native";
const CategoryItem=({category,onPress})=>{
    return (
        <TouchableOpacity
        style={styles.container}
        onPress={()=>onPress(category)}
        >
        <Text style={styles.text}>{category.toUpperCase()}</Text>
        </TouchableOpacity>
    )
}
const styles=StyleSheet.create({
    container:{
        backgroundColor:'#4E8AF4',
        padding:15,
        borderRadius:10,
        margin:5,
        alignItems:"center",
        shadowColor:"#0000",
        justifyContent:'center',
        textShadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.5,
        shadowRadius:4,
        elevation:3
    },
    text:{
        color:"white",
        fontWeight:"bold",
        fontSize:14
    }
})
export default CategoryItem;