import React, { createContext, useContext, useReducer } from 'react'
import reducer, { Action, initialState, AppState } from './reducer'

interface AppProps {
	state: AppState
	dispatch: React.Dispatch<Action>
}

interface StateProviderProps {
	reducer: typeof reducer
	initialState: AppState
	children: React.ReactNode
}

const StateContext = createContext<AppProps>({
	state: initialState,
	dispatch: () => {},
})

export const StateProvider = ({
	reducer,
	initialState,
	children,
}: StateProviderProps): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState)

	return (
		<StateContext.Provider value={{ state, dispatch }}>
			{children}
		</StateContext.Provider>
	)
}

export const useStateValue = () => useContext(StateContext)
