import React, { useState } from 'react'
import { IUser } from '../types'
import { url } from '../App'
import { ActionType } from '../reducer'
import { useStateValue } from '../StateProvider'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './Register.css'

const Register: React.FC = (): React.ReactElement => {
	const { dispatch } = useStateValue()

	const [newUser, setNewUser] = useState<IUser>({
		id: NaN,
		username: '',
		password: '',
		fullName: '',
		actions: [],
	})

	const history = useHistory()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault()
			if (
				!newUser.username.length ||
				!newUser.password ||
				!newUser.fullName.length
			) {
				alert('Please enter the required details')
				return
			}
			if (newUser.username.includes(' ')) {
				alert('username can not have spaces')
				return
			}
			const _newUser: IUser = { ...newUser, id: Date.now() }
			const res = await fetch(`${url}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(_newUser),
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
				history.push('/')
			} else {
				alert(await res.text())
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='register'>
			<form method='POST' onSubmit={e => handleSubmit(e)}>
				<input
					type='text'
					name='fullName'
					value={newUser.fullName}
					onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
					placeholder='Enter Full Name'
					autoComplete='off'
					autoFocus
				/>
				<input
					type='text'
					name='username'
					value={newUser.username}
					onChange={e => setNewUser({ ...newUser, username: e.target.value })}
					placeholder='Enter username'
					autoComplete='off'
				/>
				<input
					type='password'
					name='password'
					value={newUser.password}
					onChange={e => setNewUser({ ...newUser, password: e.target.value })}
					placeholder='Enter password'
					autoComplete='off'
				/>
				<input type='submit' value='Register' />
			</form>
			<div className='register__accountHolder'>
				<span>Already have an account?</span>
				<Link to='/'>Login here</Link>
			</div>
		</div>
	)
}

export default Register
