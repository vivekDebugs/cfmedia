import React, { useEffect } from 'react'
import './App.css'
import { useStateValue } from './StateProvider'
import { Route, Switch, useHistory } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import EachPost from './components/EachPost'
import { ActionType } from './reducer'

export const url = 'https://worker-posts.vivekkumar.workers.dev'

const App: React.FC = (): React.ReactElement => {
	const {
		state: { user },
		dispatch,
	} = useStateValue()

	// eslint-disable-next-line
	const history = useHistory()

	// if (user) {
	// 	history.push('/')
	// } else {
	// 	history.push('/login')
	// }

	useEffect(() => {
		const getAndSetUser = async () => {
			const __user__ = sessionStorage.getItem('user')
			if (__user__) {
				const user = JSON.parse(__user__)
				const credentials = {
					username: user.username,
					password: user.password,
				}
				const res = await fetch(`${url}/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(credentials),
				})
				if (res.ok) {
					const data = await res.json()
					dispatch({
						type: ActionType.SET_USER,
						payload: data,
					})
				}
			}
		}
		getAndSetUser()
	}, [dispatch])

	return (
		<div className='App'>
			<Switch>
				<Route exact path='/'>
					{user ? <Home /> : <Login />}
				</Route>
				{/* <Route exact path='/' component={Home} />
				<Route exact path='/login' component={Login} /> */}
				<Route exact path='/register' component={Register} />
				<Route exact path='/post/:postId' component={EachPost} />
				<Route exact path='/user/:username'>
					{user ? <Home userPosts /> : <Login />}
				</Route>
			</Switch>
		</div>
	)
}

export default App
