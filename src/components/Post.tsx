import React from 'react'
import { ActionType } from '../reducer'
import { useStateValue } from '../StateProvider'
import {
	Action,
	IActions,
	IFooterIcons,
	IPost,
	IUser,
	Reaction,
} from '../types'
import './Post.css'
import { AiFillCaretUp, AiFillCaretDown } from 'react-icons/ai'
import { url } from '../App'
import { useHistory } from 'react-router-dom'
import { getRandomInt, getTimePassed, renderText } from '../utils/utils'
import { GoComment } from 'react-icons/go'
import { FaRegLaughSquint } from 'react-icons/fa'
import { BsEmojiAngry, BsHeart } from 'react-icons/bs'
import { ImSad } from 'react-icons/im'
import PostFooterIcon from './PostFooterIcon'
import { Link } from 'react-router-dom'

interface IProps {
	post: IPost
}

const Post: React.FC<IProps> = ({ post }) => {
	const history = useHistory()

	const {
		state: { posts, user },
		dispatch,
	} = useStateValue()

	const { id, content, username, title, date } = post

	const handleClick = (id: number) => {
		history.push(`/post/${id}`)
	}

	const timePassed = getTimePassed(new Date(date), new Date())

	const userAction: IActions | any = user!.actions!.find(
		(a: IActions) => a.postId === id
	)

	const footerIcons: IFooterIcons[] = [
		{ id: getRandomInt(), icon: GoComment, count: post.comments.length },
		{
			id: Reaction.LAUGH,
			icon: FaRegLaughSquint,
			count: post.reactions?.[Reaction.LAUGH],
		},
		{
			id: Reaction.LOVE,
			icon: BsHeart,
			count: post.reactions?.[Reaction.LOVE],
		},
		{
			id: Reaction.ANGRY,
			icon: BsEmojiAngry,
			count: post.reactions?.[Reaction.ANGRY],
		},
		{ id: Reaction.SAD, icon: ImSad, count: post.reactions?.[Reaction.SAD] },
	]

	type KeyType = Action.UPVOTE | Action.DOWNVOTE

	const handleAction = async (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		id: number,
		key: KeyType
	) => {
		try {
			e.stopPropagation()
			if (!user) return

			const userAction: IActions | any = user?.actions.find(
				(a: IActions) => a.postId === id
			)

			const updateAndSetUserAndPosts = async (post: IPost, newUser: IUser) => {
				const res = await fetch(`${url}/posts`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(post),
				})
				if (res.ok) {
					const data = await res.json()
					const newPosts: IPost[] = posts.map((p: IPost) => {
						if (p.id === id) {
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
				const action: IActions = {
					postId: id,
					action: key,
					reaction: null,
				}
				const newActions: IActions[] = [...user.actions, action]
				const newUser: IUser = { ...user, actions: newActions }

				post.actions[key] += 1

				updateAndSetUserAndPosts(post, newUser)
			} else if (userAction !== undefined && userAction.action === null) {
				const newActions: IActions[] = user.actions.map((a: IActions) => {
					if (a.postId === id) return { ...a, action: key }
					else return a
				})
				const newUser: IUser = { ...user, actions: newActions }

				post.actions[key] += 1

				updateAndSetUserAndPosts(post, newUser)
			} else {
				const userNoneNullAction: KeyType = userAction.action
				if (userNoneNullAction === key) {
					const newActions: IActions[] = user.actions.map((a: IActions) => {
						if (a.postId === id) return { ...a, action: null }
						else return a
					})
					const newUser: IUser = { ...user, actions: newActions }

					post.actions[userNoneNullAction] -= 1

					updateAndSetUserAndPosts(post, newUser)
				} else {
					const newActions: IActions[] = user.actions.map((a: IActions) => {
						if (a.postId === id) return { ...a, action: key }
						else return a
					})
					const newUser = { ...user, actions: newActions }

					post.actions[userNoneNullAction] -= 1
					post.actions[key] += 1

					updateAndSetUserAndPosts(post, newUser)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div onClick={() => handleClick(id)} className='post'>
			<div className='post__upvoteBlock'>
				<div
					onClick={e => handleAction(e, id, Action.UPVOTE)}
					className={`post__caret ${
						userAction && userAction!.action === Action.UPVOTE ? 'bright' : ''
					}`}
				>
					<AiFillCaretUp />
				</div>
				<div>{post.actions[Action.UPVOTE] - post.actions[Action.DOWNVOTE]}</div>
				<div
					onClick={e => handleAction(e, id, Action.DOWNVOTE)}
					className={`post__caret ${
						userAction && userAction!.action === Action.DOWNVOTE ? 'bright' : ''
					}`}
				>
					<AiFillCaretDown />
				</div>
			</div>
			<div className='post__mainPost'>
				<h4 className='post__username'>
					<Link to={`/user/${username}`} onClick={e => e.stopPropagation()}>
						{username}
					</Link>
					<span className='post__timePassed'>{timePassed}</span>
				</h4>
				<h3 className='post__title'>{title}</h3>
				<p className='post__content'>{renderText(content)}</p>
				{post.mediaURL && (
					<img
						src={post.mediaURL}
						alt={post.username}
						className='post__media'
					/>
				)}
				<div className='post__footer'>
					{footerIcons.map((i, idx) => {
						return (
							<PostFooterIcon
								key={idx}
								icon={i.icon}
								count={i.count}
								size={20}
								bright={i.id === userAction?.reaction}
								postId={id}
								iconId={i.id}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Post
