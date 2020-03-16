import axios from 'axios';
import Realm from 'realm'

//Realm

class LyricItem {
    static get() {
        return realm.objects(LyricItem.schema.name)
    }

    static schema = {
        name: 'LyricItem',
        primaryKey: 'id',
        properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            artist: {type: 'string'},
            lyrics: {type: 'string'},
        }
    }
}

// Create Realm DB

const realm = new Realm({schema: [LyricItem]});

//Action Creators
export const GET_REPOS_SUCCESS = 'my-awesome-app/repos/LOAD_SUCCESS';
export const GET_LYRICS_SUCCESS = 'my-awesome-app/lyrics/GET_LYRICS_SUCCESS';
export const API_FAIL = 'my-awesome-app/repos/LOAD_FAIL';
export const API_STATUS = 'my-awesome-app/repos/API_STATUS';
export const SAVE_LYRICS = 'my-awesome-app/repos/SAVE_LYRIC';
export const SET_LYRICS = 'my-awesome-app/repos/SET_LYRICS';

//Initial State
const initialState = {
    repos: [],
    lyrics: '',
    currentSong: {
        artist: '',
        title: ''
    },
    savedLyrics: [],
    isLoading: false,
    error: '',
};

//Reducers
export default function RepoReducer(state = initialState, action) {
    switch (action.type) {
        case GET_REPOS_SUCCESS:
            const test = [];
            action.payload.map(item => {
                test.push(item.name)
            });
            return {...state, repos: test};
        case GET_LYRICS_SUCCESS:
            const {lyrics, artist, title} = action.payload;
            return {
                ...state,
                lyrics,
                currentSong: {
                    ...state.currentSong,
                    artist,
                    title
                }
            };
        case SAVE_LYRICS:
            const titleCheck = state.savedLyrics.find(({title}) =>
                title === state.currentSong.title
            );

            if (titleCheck) {
                return state
            } else {
                return {
                    ...state,
                    savedLyrics: [
                        ...state.savedLyrics,
                        {
                            artist: state.currentSong.artist,
                            title: state.currentSong.title
                        }
                    ]
                };
            }
        case SET_LYRICS:
            return {
                ...state,
                savedLyrics: action.payload
            };
        case API_FAIL:
            return {
                ...state,
                error: action.payload
            };
        case API_STATUS:
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
}

//Actions
export function listRepoSuccess(data) {
    return {
        type: GET_REPOS_SUCCESS,
        payload: data
    };
}

export function lyricSuccess(data) {
    return {
        type: GET_LYRICS_SUCCESS,
        payload: data
    };
}

export function saveLyrics() {
    return {
        type: SAVE_LYRICS
    };
}

export function setLyricsFromStorage(storage) {
    return {
        type: SET_LYRICS,
        payload: storage
    }
}

export function apiFail(message) {
    return {
        type: API_FAIL,
        payload: message
    };
}

export function setApiStatus(status) {
    return {
        type: API_STATUS,
        payload: status
    };
}

//Thunks
export function fetchRepos(user) {
    return async function (dispatch) {
        try {
            dispatch(setApiStatus(true));

            const res = await axios.get(`https://api.github.com/users/${user}/repos`);
            dispatch(listRepoSuccess(res.data));
            dispatch(setApiStatus(false));
        } catch (error) {
            console.log(error);
            dispatch(setApiStatus(false));
            dispatch(apiFail('Error fetching repos'))
        }
    }
}

export function fetchLyrics({artist, title}) {
    return async function (dispatch) {
        try {
            dispatch(setApiStatus(true));
            const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
                .then((response) => {
                    return response.json();
                });
            dispatch(lyricSuccess({
                lyrics: res.error || res.lyrics,
                artist,
                title
            }));
            console.log(res);
            dispatch(setApiStatus(false));
        } catch (error) {
            console.log(error);
            dispatch(setApiStatus(false));
            dispatch(apiFail('Error fetching lyrics'))
        }
    }
}

export function saveLyricsToStorage() {
    return async function (dispatch, getState) {
        await dispatch(saveLyrics());
        // const state = getState().repo;

        const createTodoItem = (value) => {
            realm.write(() => {
                realm.create(TodoItem.schema.name, {
                    id: uuid.v1(),
                    value,
                    createdTimestamp: new Date()
                })
            })
        }
    }
}

export function fetchLyricsFromStorage() {
    return async function (dispatch) {
         const getTodoItems = () => {
            const todoItems = TodoItem.get().sorted('createdTimestamp', true)
            return todoItems
        }
    }
}

