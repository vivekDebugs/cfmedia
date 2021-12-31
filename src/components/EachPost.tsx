import React, { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { ActionType } from '../reducer'
import { useStateValue } from '../StateProvider'
import { IActions, IComment, IFooterIcons, IPost, Reaction } from '../types'
import { url } from '../App'
import {
	convertToReadableDate,
	getRandomInt,
	getTimePassed,
	renderText,
} from '../utils/utils'
import './EachPost.css'
import { AiFillHome } from 'react-icons/ai'
import { GoComment } from 'react-icons/go'
import { FaRegLaughSquint } from 'react-icons/fa'
import { BsEmojiAngry, BsHeart } from 'react-icons/bs'
import { ImSad } from 'react-icons/im'
import PostFooterIcon from './PostFooterIcon'

interface IProps {}

const EachPost: React.FC<IProps> = (): React.ReactElement => {
	const { postId } = useParams<{ postId: string }>()
	const {
		state: { user, posts, eachPost },
		dispatch,
	} = useStateValue()

	const [commentText, setCommentText] = useState<string>('')

	const history = useHistory()

	const setEachPost = () => {
		const post = posts.find((p: IPost) => p.id === parseInt(postId))
		if (post) {
			dispatch({
				type: ActionType.SET_EACH_POST,
				payload: post,
			})
		}
	}

	useEffect(() => {
		if (!user || !posts) {
			history.push('/')
		}
		setEachPost()
		// eslint-disable-next-line
	}, [])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault()
			if (commentText.length) {
				const comment: IComment = {
					id: Date.now(),
					comment: commentText,
					date: new Date().toString(),
					postId: parseInt(postId),
					username: user!.username,
				}
				const res = await fetch(`${url}/post/comments`, {
					method: 'POST',
					headers: { 'Contenty-Type': 'application/json' },
					body: JSON.stringify(comment),
				})
				const data: IPost = await res.json()
				setCommentText('')
				dispatch({
					type: ActionType.SET_EACH_POST,
					payload: data,
				})
				dispatch({
					type: ActionType.SET_POSTS,
					payload: posts.map((p: IPost) => {
						if (p.id === data.id) {
							return data
						} else return p
					}),
				})
			}
		} catch (error) {
			let err
			if (error instanceof Error) err = error
			console.log(err)
		}
	}

	const footerIcons: IFooterIcons[] = [
		{ id: getRandomInt(), icon: GoComment, count: eachPost?.comments.length },
		{
			id: Reaction.LAUGH,
			icon: FaRegLaughSquint,
			count: eachPost?.reactions[Reaction.LAUGH],
		},
		{
			id: Reaction.LOVE,
			icon: BsHeart,
			count: eachPost?.reactions[Reaction.LOVE],
		},
		{
			id: Reaction.ANGRY,
			icon: BsEmojiAngry,
			count: eachPost?.reactions[Reaction.ANGRY],
		},
		{ id: Reaction.SAD, icon: ImSad, count: eachPost?.reactions[Reaction.SAD] },
	]

	const userAction: IActions | any = user?.actions.find(
		(a: IActions) => a.postId === eachPost?.id
	)

	return (
		<div className='eachPost'>
			<Link to='/' className='eachPost__navButton nav'>
				<AiFillHome />
			</Link>
			<div className='eachPost__post'>
				<h4 className='eachPost__username'>
					<Link to={`/user/${eachPost?.username}`}>{eachPost?.username}</Link>
				</h4>
				<h3 className='eachPost__title'>{eachPost?.title}</h3>
				<p className='eachPost__content'>
					{eachPost?.content && renderText(eachPost.content)}
				</p>
				{eachPost?.mediaURL && (
					<img
						src={eachPost.mediaURL}
						alt={eachPost.username}
						className='eachPost__media'
					/>
				)}
				<div className='eachPost__date'>
					<span>
						{eachPost?.date && new Date(eachPost!.date).toLocaleTimeString()}
					</span>
					<span>
						{eachPost?.date && convertToReadableDate(new Date(eachPost!.date))}
					</span>
				</div>
				<div className='post__footer'>
					{eachPost
						? footerIcons.map((i, idx) => {
								return (
									<PostFooterIcon
										key={idx}
										icon={i.icon}
										count={i.count}
										size={20}
										bright={i.id === userAction?.reaction}
										postId={eachPost?.id}
										iconId={i.id}
									/>
								)
						  })
						: null}
				</div>
				<form method='POST' onSubmit={e => handleSubmit(e)}>
					<input
						type='text'
						value={commentText}
						onChange={e => setCommentText(e.target.value)}
						placeholder='leave your comment...'
					/>
					<input type='submit' value='Comment' />
				</form>
			</div>
			<div className='eachPost__comments'>
				{eachPost?.comments
					?.sort((a: IComment, b: IComment) =>
						new Date(b.date) > new Date(a.date) ? 1 : -1
					)
					.map((c: IComment) => {
						const { date, username, comment, id } = c
						const timePassed: string = getTimePassed(new Date(date), new Date())
						return (
							<div className='eachPost__comment' key={id}>
								<h4 className='eachPost__username'>
									<Link to={`/user/${username}`}>{username}</Link>
									<span className='eachPost__timePassed'>{timePassed}</span>
								</h4>
								<p className='eachPost__commentText'>{renderText(comment)}</p>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default EachPost
