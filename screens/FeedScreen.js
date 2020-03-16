import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    StyleSheet,
    Text,
    FlatList,
    View,
    TextInput,
    ActivityIndicator,
    TouchableHighlight,
    SafeAreaView
} from 'react-native';
import {fetchRepos} from '../reducers/reducer';
import TabBarIcon from '../components/TabBarIcon';
import * as WebBrowser from 'expo-web-browser';

function FeedScreen({repos, fetchRepos, isLoading}) {
    const [value, setValue] = useState('');
    const [currentValue, setCurrentValue] = useState('');

    function renderItems({item}) {
        return (
            <View>
                <TouchableHighlight underlayColor={'#fe346e'}
                                    onPress={() => WebBrowser.openBrowserAsync(`https://github.com/${currentValue}/${item}`)}>
                    <View style={styles.item}>
                        <TabBarIcon focused={true} name="md-globe"/>
                        <Text style={styles.listText}>{item}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={styles.formContainer}>
                <Text style={styles.getStartedText}>Search GitHub Repos</Text>
                <TextInput
                    style={{
                        height: 40,
                        color: '#2c003e',
                        borderColor: '#2c003e',
                        borderWidth: 1,
                        borderRadius: 10,
                        margin: 15,
                        paddingLeft: 15
                    }}
                    onChangeText={text => setValue(text)}
                    value={value}
                    placeholder={'GitHub Username'}
                    returnKeyType={'search'}
                    onSubmitEditing={() => {
                        fetchRepos(value);
                        setCurrentValue(value);
                    }
                    }
                />
            </View>
            {isLoading ?
                <View style={styles.container}>
                    <ActivityIndicator size={125} color="#fe346e" style={{marginTop: 30}}/>
                </View>
                :
                <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
                    <FlatList
                        keyExtractor={item => item}
                        data={repos}
                        renderItem={renderItems}
                    />
                </SafeAreaView>
            }
        </View>
    );
}

FeedScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%'
    },
    formContainer: {
        paddingTop: 15,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginTop: 15
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    listText: {
        marginLeft: 30,
        marginTop: 5
    }
});

const mapStateToProps = state => ({
    repos: state.repo.repos,
    isLoading: state.repo.isLoading
});

const mapDispatchToProps = {
    fetchRepos
};


export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen);
