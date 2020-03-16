import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import TabBarIcon from "../components/TabBarIcon";
import {connect} from "react-redux";
import {fetchLyricsFromStorage} from "../reducers/reducer";

function SavedSongsScreen({savedLyrics, fetchLyricsFromStorage}) {

    useEffect(() => {
        if (savedLyrics) return;
        fetchLyricsFromStorage()
    });

    function renderItems({item}) {
        return (
            <View>
                <TouchableHighlight underlayColor={'#fe346e'}>
                    <View style={styles.item}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TabBarIcon size={31} focused={true} name="md-musical-notes"/>
                            <View style={styles.listText}>
                                <Text>Artist: {item.artist}</Text>
                                <Text>Title: {item.title}</Text>
                            </View>
                        </View>
                        <View>
                            <TabBarIcon size={31} focused={true} name='md-trash'/>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
            {savedLyrics.length !== 0 ?
                <FlatList
                    keyExtractor={item => item.title}
                    data={savedLyrics}
                    renderItem={renderItems}
                />
                :
                <View style={styles.item}>
                    <Text>You Currently Have No Saved Lyrics</Text>
                </View>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        paddingTop: 15,
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
    }
});

const mapStateToProps = state => ({
    savedLyrics: state.repo.savedLyrics,
    isLoading: state.repo.isLoading
});

const mapDispatchToProps = {
    fetchLyricsFromStorage
};


export default connect(mapStateToProps, mapDispatchToProps)(SavedSongsScreen);
