import React from 'react'
import { IPost, IUser } from './types'

export interface AppState {
	posts: IPost[] | []
	showAddPost: boolean
	user: IUser | null
	eachPost: IPost | null
}

export enum ActionType {
	SET_POSTS,
	SET_SHOW_ADD_POST,
	SET_USER,
	SET_EACH_POST,
}

export type Action =
	| { type: ActionType.SET_POSTS; payload: IPost[] }
	| { type: ActionType.SET_SHOW_ADD_POST; payload: boolean }
	| { type: ActionType.SET_USER; payload: IUser | null }
	| { type: ActionType.SET_EACH_POST; payload: IPost }

export const initialState: AppState = {
	posts: [],
	showAddPost: false,
	user: null,
	eachPost: null,
}

const reducer: React.Reducer<AppState, Action> = (state, action) => {
	switch (action.type) {
		case ActionType.SET_POSTS:
			return {
				...state,
				posts: action.payload,
			}

		case ActionType.SET_SHOW_ADD_POST:
			return {
				...state,
				showAddPost: action.payload,
			}

		case ActionType.SET_USER:
			return {
				...state,
				user: action.payload,
			}

		case ActionType.SET_EACH_POST:
			return {
				...state,
				eachPost: action.payload,
			}

		default:
			return state
	}
}

export default reducer
