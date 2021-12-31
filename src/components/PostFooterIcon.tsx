import React from 'react'
import { GoComment } from 'react-icons/go'
import { url } from '../App'
import { ActionType } from '../reducer'
import { useStateValue } from '../StateProvider'
import { IActions, IconType, IPost, IUser, Reaction } from '../types'
import './PostFooterIcon.css'

type IconIdType = Reaction.LAUGH | Reaction.LOVE | Reaction.ANGRY | Reaction.SAD

interface IProps {
	icon: IconType
	count?: number
	size: number
	bright: boolean
	postId: number
	iconId: IconIdType
}

const PostFooterIcon: React.FC<IProps> = ({
	icon,
	count,
	size,
	bright,
	postId,
	iconId,
}): React.ReactElement => {
	const {
		state: { user, posts },
		dispatch,
	} = useStateValue()

	const handleReaction = async (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		try {
			e.stopPropagation()
			if (!user) return

			const userAction: IActions | any = user.actions.find(
				(a: IActions) => a.postId === postId
			)
			const reactedPost: IPost | any = posts.find((p: IPost) => p.id === postId)

			const updateAndSetUserAndPosts = async (post: IPost, newUser: IUser) => {
				const res = await fetch(`${url}/posts`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(post),
				})
				if (res.ok) {
					const data = await res.json()
					const newPosts: IPost[] = posts.map((p: IPost) => {
						if (p.id === postId) {
							return data
						} else return p
					})
					dispatch({
						type: ActionType.SET_POSTS,
						payload: newPosts,
					})
				} else {
					console.log(await res.text())
				}

				const _res = await fetch(`${url}/updateUser`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newUser),
				})
				if (_res.ok) {
					const _data = await _res.json()
					dispatch({
						type: ActionType.SET_USER,
						payload: _data,
					})
				} else {
					console.log(await _res.text())
				}
			}

			if (userAction === undefined) {
				const action = {
					postId: postId,
					action: null,
					reaction: iconId,
				}
				const newActions: IActions[] = [...user.actions, action]
				const newUser: IUser = { ...user, actions: newActions }

				reactedPost!.reactions[iconId] += 1

				updateAndSetUserAndPosts(reactedPost, newUser)
			} else if (userAction !== undefined && userAction.reaction == null) {
				const newActions: IActions[] = user.actions.map((a: IActions) => {
					if (a.postId === postId) {
						return { ...a, reaction: iconId }
					} else return a
				})
				const newUser: IUser = { ...user, actions: newActions }

				reactedPost!.reactions[iconId] += 1

				updateAndSetUserAndPosts(reactedPost, newUser)
			} else {
				const userNoneNullReaction: IconIdType = userAction.reaction
				if (userNoneNullReaction === iconId) {
					const newActions: IActions[] = user.actions.map((a: IActions) => {
						if (a.postId === postId) {
							return { ...a, reaction: null }
						} else return a
					})
					const newUser: IUser = { ...user, actions: newActions }

					reactedPost!.reactions[userNoneNullReaction] -= 1

					updateAndSetUserAndPosts(reactedPost, newUser)
				} else {
					const newActions: IActions[] = user.actions.map((a: IActions) => {
						if (a.postId === postId) {
							return { ...a, reaction: iconId }
						} else return a
					})
					const newUser: IUser = { ...user, actions: newActions }

					reactedPost!.reactions[userNoneNullReaction] -= 1
					reactedPost!.reactions[iconId] += 1

					updateAndSetUserAndPosts(reactedPost, newUser)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	if (icon === GoComment) {
		return (
			<div className='postFooterIcon'>
				{React.createElement(icon, { size: size })}
				<span className='postFooterIcon__count'>{count !== 0 && count}</span>
			</div>
		)
	} else {
		return (
			<div
				onClick={e => handleReaction(e)}
				className={`postFooterIcon reactionIcon ${bright ? 'bright' : ''}`}
			>
				{React.createElement(icon, { size: size })}
				<span className='postFooterIcon__count'>{count !== 0 && count}</span>
			</div>
		)
	}
}

export default PostFooterIcon
