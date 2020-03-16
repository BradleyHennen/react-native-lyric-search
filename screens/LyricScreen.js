import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import {fetchLyrics, saveLyricsToStorage} from '../reducers/reducer';
import TabBarIcon from "../components/TabBarIcon";

function LyricScreen({fetchLyrics, lyrics, currentSong, isLoading, saveLyricsToStorage}) {
    const [title, setTitle] = useState('All Star');
    const [artist, setArtist] = useState('Smash Mouth');
    let textInputRef = null;


    function handleSaveLyrics() {
        saveLyricsToStorage();

        Alert.alert(
            'Lyrics Saved!',
            '',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
        );
    }

    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={styles.formContainer}>
                <Text style={styles.getStartedText}>Search Lyrics</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => setArtist(text)}
                    value={artist}
                    placeholder={'Artist'}
                    returnKeyType={'next'}
                    onSubmitEditing={() => {
                        textInputRef.focus();
                    }}
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => setTitle(text)}
                    value={title}
                    placeholder={'Title'}
                    returnKeyType={'search'}
                    ref={(input) => {
                        return textInputRef = input
                    }}
                    onSubmitEditing={() => {
                        fetchLyrics({artist, title})
                    }}
                />
            </View>
            {isLoading ?
                <View style={{...styles.container, flex: 1}}>
                    <ActivityIndicator size={125} color="#fe346e" style={{marginTop: 30}}/>
                </View>
                :
                lyrics.length > 0 &&
                        <View style={{...styles.container, flex: 1}}>
                            <View style={{...styles.lyrics, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                    <Text style={styles.getStartedText}>Title: {currentSong.title}</Text>
                                    <Text style={styles.getStartedText}>Artist: {currentSong.artist}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleSaveLyrics()}
                                >
                                    <TabBarIcon size={35} focused={true} name="ios-save"/>
                                </TouchableOpacity>
                            </View>
                            <SafeAreaView style={{flex: 1}}>
                                <ScrollView style={{flex: 1}}>
                                    <Text style={styles.lyrics}>{lyrics}</Text>
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                }
        </View>
    );
}

LyricScreen.navigationOptions = {
    header: null
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
        paddingTop: 10,
    },
    formContainer: {
        paddingTop: 15,
    },
    getStartedText: {
        fontSize: 20,
        color: '#fe346e',
        lineHeight: 24,
        textAlign: 'center',
    },
    textInput: {
        height: 40,
        color: '#2c003e',
        borderColor: '#2c003e',
        borderWidth: 1,
        borderRadius: 10,
        margin: 15,
        paddingLeft: 15
    },
    lyrics: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15,
        marginBottom: 25
    },
    button: {
        marginRight: 10
    }
});

const mapStateToProps = state => ({
    lyrics: state.repo.lyrics,
    currentSong: state.repo.currentSong,
    isLoading: state.repo.isLoading
});

const mapDispatchToProps = {
    fetchLyrics,
    saveLyricsToStorage
};


export default connect(mapStateToProps, mapDispatchToProps)(LyricScreen);
