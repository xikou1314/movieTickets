import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
} from 'react-native';
export default class EditView extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    render() {
        return (
            <View style={LoginStyles.TextInputView}>
                <TextInput style={LoginStyles.TextInput}
                           placeholder={this.props.name}
                           secureTextEntry={this.props.password}
                           underlineColorAndroid={"transparent"}
                           onChangeText={
                               (text) => {
                                   this.setState({text});
                                   this.props.onChangeText(text);
                               }
                           }
                />
            </View>
        );
    }
}


const LoginStyles = StyleSheet.create({
    TextInputView: {
        marginTop: 10,
        height:50,
        backgroundColor: '#ffffff',
        borderRadius:6,
        borderWidth:1,
        borderColor:'#ccc',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    TextInput: {
        backgroundColor: '#ffffff',
        height:45,
        margin:18
    },
});