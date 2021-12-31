import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { url } from '../App'
import { ActionType } from '../reducer'
import { useStateValue } from '../StateProvider'
import { IUser } from '../types'
import './Login.css'

const Login: React.FC = (): React.ReactElement => {
	const { dispatch } = useStateValue()
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault()
			if (!username.length || !password.length) {
				alert('Please enter the credentials')
				return
			}
			const credentials = {
				username: username,
				password: password,
			}
			const res = await fetch(`${url}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			})
			if (res.ok) {
				const data = await res.json()
				const __user__ = JSON.stringify({
					username: data.username,
					password: data.password,
				})
				sessionStorage.setItem('user', __user__)
				dispatch({
					type: ActionType.SET_USER,
					payload: data,
				})
			} else {
				alert(await res.text())
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleGuestLogin = async () => {
		try {
			const guestUser: IUser = {
				id: Date.now(),
				username: `guest`,
				password: '',
				fullName: `Guest`,
				actions: [],
			}
			const guestUserCredentials = {
				username: guestUser.username,
				password: guestUser.password,
			}
			const res = await fetch(`${url}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(guestUserCredentials),
			})
			if (res.ok) {
				const data = await res.json()
				const __user__ = JSON.stringify({
					username: data.username,
					password: data.password,
				})
				sessionStorage.setItem('user', __user__)
				dispatch({
					type: ActionType.SET_USER,
					payload: data,
				})
			} else {
				const res = await fetch(`${url}/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(guestUser),
				})
				if (res.ok) {
					const data = await res.json()
					const __user__ = JSON.stringify({
						username: data.username,
						password: data.password,
					})
					sessionStorage.setItem('user', __user__)
					dispatch({
						type: ActionType.SET_USER,
						payload: data,
					})
				} else {
					alert('Sorry, There is an issue loggin in.')
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='login'>
			<form method='POST' onSubmit={e => handleSubmit(e)}>
				<input
					type='text'
					value={username}
					onChange={e => setUsername(e.target.value)}
					placeholder='Username'
					autoComplete='off'
					autoFocus
				/>
				<input
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder='Password'
					autoComplete='off'
				/>
				<input type='submit' value='Login' />
			</form>
			<div className='login__newUser'>
				<span>New User?</span>
				<Link to='/register'>Register here</Link>
			</div>
			<div className='login__or'>
				<span>OR</span>
			</div>
			<div className='login__guest'>
				<button onClick={handleGuestLogin}>Continue as Guest</button>
			</div>
		</div>
	)
}

export default Login
